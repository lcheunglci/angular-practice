import { normalize } from '@angular-devkit/core';
import {
  apply,
  MergeStrategy,
  mergeWith,
  move,
  Rule,
  SchematicContext,
  Tree,
  url,
} from '@angular-devkit/schematics';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function orderWizard(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const folderPath = normalize(_options.path + '/' + _options.name);
    let files = url('./files');

    const newTree = apply(files, [move(folderPath)]);

    const templateRule = mergeWith(newTree, MergeStrategy.Default);

    return templateRule(tree, _context);
  };
}
