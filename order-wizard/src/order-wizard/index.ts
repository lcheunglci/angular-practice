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
} from '@angular-devkit/schematics';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function orderWizard(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const folderPath = normalize(
      strings.dasherize(_options.path + '/' + _options.name),
    );

    const workspace = getWorkspace(tree, _options);
    console.log(workspace);

    let files = url('./files');

    const newTree = apply(files, [
      move(folderPath),
      template({ ...strings, ..._options }),
      specFilter(_options),
    ]);

    const templateRule = mergeWith(newTree, MergeStrategy.Default);

    return templateRule(tree, _context);
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

    const rec = tree.beginUpdate(rootModulePath);
    rec.insertLeft(0, importContent);
    tree.commitUpdate(rec);

    return tree;
  };
}
