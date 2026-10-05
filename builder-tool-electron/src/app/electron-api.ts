export interface Project {
  path: string;
  name: string;
  hasPackageJson: boolean;
  deployTo: string | null;
}

export type BuildScript = 'install' | 'build';

export type RunAction = BuildScript | 'deploy';

export interface AddProjectResult {
  canceled: boolean;
  added: boolean;
  reason?: string;
  project?: Project;
}

export interface SetDeployResult {
  canceled: boolean;
  set: boolean;
  reason?: string;
  project?: Project;
}

export interface ProjectChanges {
  name?: string;
  path?: string;
  deployTo?: string | null;
}

export interface UpdateProjectResult {
  updated: boolean;
  reason?: string;
  project?: Project;
}

export interface StartRunResult {
  started: boolean;
  runId?: number;
  reason?: string;
}

export type RunEvent =
  | { type: 'started'; runId: number; projectPath: string; script: string; command: string }
  | { type: 'stdout'; runId: number; line: string }
  | { type: 'stderr'; runId: number; line: string }
  | { type: 'exit'; runId: number; code: number }
  | { type: 'error'; runId: number; message: string };

export interface ElectronBuilderApi {
  listProjects(): Promise<Project[]>;
  addProject(): Promise<AddProjectResult>;
  removeProject(projectPath: string): Promise<boolean>;
  updateProject(projectPath: string, changes: ProjectChanges): Promise<UpdateProjectResult>;
  setDeployDir(projectPath: string): Promise<SetDeployResult>;
  runScript(projectPath: string, script: BuildScript): Promise<StartRunResult>;
  startDeploy(projectPath: string): Promise<StartRunResult>;
  cancelRun(runId: number): Promise<{ canceled: boolean }>;
  runningRunId(): Promise<number | null>;
  onRunEvent(callback: (event: RunEvent) => void): () => void;
}

declare global {
  interface Window {
    builderApi: ElectronBuilderApi;
  }
}
