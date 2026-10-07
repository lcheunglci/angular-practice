import { Injectable } from '@angular/core';
import {
  AddProjectResult,
  BuildScript,
  CloneRepoResult,
  ElectronBuilderApi,
  PickDirOptions,
  PickDirResult,
  PickTextOptions,
  PickTextResult,
  Project,
  ProjectChanges,
  RunEvent,
  SetDeployResult,
  StartRunResult,
  UpdateProjectResult
} from './electron-api';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  listProjects(): Promise<Project[]> {
    return this.requireApi().listProjects();
  }

  addProject(): Promise<AddProjectResult> {
    return this.requireApi().addProject();
  }

  removeProject(projectPath: string): Promise<boolean> {
    return this.requireApi().removeProject(projectPath);
  }

  updateProject(projectPath: string, changes: ProjectChanges): Promise<UpdateProjectResult> {
    return this.requireApi().updateProject(projectPath, changes);
  }

  cloneRepo(url: string, parentDir: string, folderName: string): Promise<CloneRepoResult> {
    return this.requireApi().cloneRepo(url, parentDir, folderName);
  }

  pickDir(options?: PickDirOptions): Promise<PickDirResult> {
    return this.requireApi().pickDir(options);
  }

  pickText(options?: PickTextOptions): Promise<PickTextResult> {
    return this.requireApi().pickText(options);
  }

  setDeployDir(projectPath: string): Promise<SetDeployResult> {
    return this.requireApi().setDeployDir(projectPath);
  }

  runScript(projectPath: string, script: BuildScript): Promise<StartRunResult> {
    return this.requireApi().runScript(projectPath, script);
  }

  startDeploy(projectPath: string): Promise<StartRunResult> {
    return this.requireApi().startDeploy(projectPath);
  }

  cancelRun(runId: number): Promise<{ canceled: boolean }> {
    return this.requireApi().cancelRun(runId);
  }

  runningRunId(): Promise<number | null> {
    return this.requireApi().runningRunId();
  }

  onRunEvent(callback: (event: RunEvent) => void): () => void {
    return this.requireApi().onRunEvent(callback);
  }

  private requireApi(): ElectronBuilderApi {
    if (!window.builderApi) {
      throw new Error(
        'Electron API is not available. Run the app via Electron (npm run electron:dev or electron:start).'
      );
    }
    return window.builderApi;
  }
}
