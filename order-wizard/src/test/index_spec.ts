import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';

import * as angularJsonStub from './stubs/angular.json';
import * as appModuleStub from './stubs/app.module.json';
import * as packageJsonStub from './stubs/package.json';

const collectionPath = path.join(__dirname, '../collection.json');

describe('order-wizard', () => {
  it('works', async () => {
    const testTree = Tree.empty();
    testTree.create('./angular.json', JSON.stringify(angularJsonStub));
    testTree.create(
      './src/app/app.module.ts',
      JSON.stringify(appModuleStub.content),
    );
    testTree.create('./package.json', JSON.stringify(packageJsonStub));
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const tree = await runner.runSchematic(
      'order-wizard',
      { name: 'test' },
      testTree,
    );

    expect(tree.files.length).toEqual(10);
  });
});
