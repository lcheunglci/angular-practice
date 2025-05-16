import {
  normalize,
  strings,
  virtualFs,
  workspaces,
} from '@angular-devkit/core';
import {
  apply,
  filter,
  MergeStrategy,
  mergeWith,
  move,
  Rule,
  SchematicContext,
  template,
  Tree,
  url,
  SchematicsException,
  chain,
  TaskId,
} from '@angular-devkit/schematics';

import {
  NodePackageInstallTask,
  RunSchematicTask,
} from '@angular-devkit/schematics/tasks';

import { NodePackageTaskOptions } from '@angular-devkit/schematics/tasks/package-manager/options';

import * as ts from 'typescript';

let materialTaskId: TaskId;

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function orderWizard(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const folderPath = normalize(
      strings.dasherize(_options.path + '/' + _options.name),
    );

    const workspace = getWorkspace(tree, _options);

    let files = url('./files');

    const newTree = apply(files, [
      move(folderPath),
      template({ ...strings, ..._options }),
      specFilter(_options),
    ]);

    const templateRule = mergeWith(newTree, MergeStrategy.Default);
    const updateModuleRule = updateRootModule(_options, workspace);
    const installMaterialRule = installMaterial();
    const addMaterialRule = addMaterial();
    const chainedRule = chain([
      templateRule,
      updateModuleRule,
      installMaterialRule,
      addMaterialRule,
    ]);

    return chainedRule(tree, _context);
  };
}

function specFilter(_options: any): Rule {
  if (_options.spec === 'false') {
    return filter((path) => {
      return !path.match(/\.spec\.ts$/) && !path.match(/test\.ts$/);
    });
  } else {
    return filter((path) => !path.match(/\test\.ts$/));
  }
}

// old way:
// function getWorkspace(_options: any, tree: Tree): experimental.workspace.WorkspaceSchema {
//   const workspace = tree.read('/angular.json');

//   if (!workspace) {
//     throw new SchematicsException("angular.json file not found");
//   }

//   return JSON.parse(workspace.toString());
// }

// current way to get the workspace https://angular.dev/tools/cli/schematics-for-libraries
function createHost(tree: Tree): workspaces.WorkspaceHost {
  return {
    async readFile(path: string): Promise<string> {
      const data = tree.read(path);
      if (!data) {
        throw new SchematicsException('File not found.');
      }
      return virtualFs.fileBufferToString(data);
    },
    async writeFile(path: string, data: string): Promise<void> {
      return tree.overwrite(path, data);
    },
    async isDirectory(path: string): Promise<boolean> {
      return !tree.exists(path) && tree.getDir(path).subfiles.length > 0;
    },
    async isFile(path: string): Promise<boolean> {
      return tree.exists(path);
    },
  };
}

async function getWorkspace(tree: Tree, options: any) {
  const host = createHost(tree);
  const { workspace } = await workspaces.readWorkspace('/', host);

  const project =
    options.project != null ? workspace.projects.get(options.project) : null;
  if (!project) {
    throw new SchematicsException(`Invalid project name: ${options.project}`);
  }

  return workspace;
}

// export function myService(options: MyServiceSchema): Rule {
//   return async (tree: Tree) => {
//     const host = createHost(tree);
//     const {workspace} = await workspaces.readWorkspace('/', host);

//   const project = options.project != null ? workspace.projects.get(options.project) : null;
//     if (!project) {
//       throw new SchematicsException(`Invalid project name: ${options.project}`);
//     }

// }

function updateRootModule(_options: any, workspace: any): Rule {
  return (tree: Tree, _context: SchematicContext): Tree => {
    _options.project =
      _options.project === 'defaultProject'
        ? workspace.defaultProject
        : _options.project;

    const project = workspace.projects[_options.project];
    const moduleName = strings.dasherize(_options.name);
    const exportedModuleName = strings.classify(_options.name);
    const modulePath = strings.classify(_options.path);
    const rootModulePath =
      `${project.root}/` +
      `${project.sourceRoot}/` +
      `${project.prefix}/` +
      `${project.prefix}/module.ts`;

    const importContent =
      `import { ${exportedModuleName}Module }` +
      `from './${modulePath}/${moduleName}/${moduleName}.module';`;

    const moduleFile = getAsSourceFile(tree, rootModulePath);

    const lastImportEndPos = findlastImportEndPos(moduleFile);

    const findImportArrayEndPos = findImportArray(moduleFile);

    const rec = tree.beginUpdate(rootModulePath);

    rec.insertLeft(lastImportEndPos + 1, importContent);
    rec.insertLeft(findImportArrayEndPos - 1, `, ${exportedModuleName}Module`);
    tree.commitUpdate(rec);

    return tree;
  };
}

function getAsSourceFile(tree: Tree, path: string): ts.SourceFile {
  const file = tree.read(path);
  if (!file) {
    throw new SchematicsException(`${path} not found`);
  }
  return ts.createSourceFile(
    path,
    file.toString(),
    ts.ScriptTarget.Latest,
    true,
  );
}

function findlastImportEndPos(file: ts.SourceFile): number {
  let pos: number = 0;

  file.forEachChild((child: ts.Node) => {
    if (child.kind === ts.SyntaxKind.ImportDeclaration) {
      pos = child.end;
    }
  });

  return pos;
}

function findImportArray(file: ts.SourceFile): number {
  let pos: number = 0;

  file.forEachChild((node: ts.Node) => {
    if (node.kind == ts.SyntaxKind.ClassDeclaration) {
      node.forEachChild((classChild: ts.Node) => {
        if (classChild.kind === ts.SyntaxKind.Decorator) {
          classChild.forEachChild((moduleDeclaration: ts.Node) => {
            moduleDeclaration.forEachChild((objectLiteral: ts.Node) => {
              objectLiteral.forEachChild((property: ts.Node) => {
                if (property.getFullText().includes('imports')) {
                  pos = property.end;
                }
              });
            });
          });
        }
      });
    }
  });

  return pos;
}

export function installMaterial(): Rule {
  return (tree: Tree, _context: SchematicContext): Tree => {
    const packageJsonPath = '/package.json';
    const materialDepName = '@angular/material';
    const packageJson = getAsSourceFile(tree, packageJsonPath);
    let materialInstalled = false;

    packageJson.forEachChild((node: ts.Node) => {
      if (node.kind == ts.SyntaxKind.ExpressionStatement) {
        node.forEachChild((objectLiteral: ts.Node) => {
          objectLiteral.forEachChild((property: ts.Node) => {
            if (property.getFullText().includes('dependencies')) {
              property.forEachChild((dependency) => {
                if (dependency.getFullText().includes(materialDepName)) {
                  _context.logger.info('Angular Material already installed');
                  materialInstalled = true;
                }
              });
            }
          });
        });
      }
    });

    if (!materialInstalled) {
      const options = <NodePackageTaskOptions>{
        packageName: materialDepName,
      };

      materialTaskId = _context.addTask(new NodePackageInstallTask(options));
      _context.logger.info('Installing Angular Material');
    }

    return tree;
  };
}

function addMaterial(): Rule {
  return (tree: Tree, _context: SchematicContext): Tree => {
    const options = {
      theme: 'indigo-pink',
      gestures: true,
      animations: true,
    };

    _context.addTask(
      new RunSchematicTask('@angular/material', 'ng-add', options),
      [materialTaskId],
    );
    _context.logger.info('Configuring Angular Material');

    return tree;
  };
}
