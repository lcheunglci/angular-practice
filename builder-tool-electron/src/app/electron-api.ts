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

export interface CloneRepoResult {
  cloned: boolean;
  path?: string;
  reason?: string;
  node?: boolean;
  hasBuild?: boolean;
  scripts?: string[];
}

export interface PickDirOptions {
  title?: string;
  buttonLabel?: string;
}

export interface PickDirResult {
  canceled: boolean;
  path?: string;
}

export interface PickTextOptions {
  title?: string;
  placeholder?: string;
  value?: string;
}

export interface PickTextResult {
  canceled: boolean;
  value?: string;
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
  cloneRepo(url: string, parentDir: string, folderName: string): Promise<CloneRepoResult>;
  pickDir(options?: PickDirOptions): Promise<PickDirResult>;
  pickText(options?: PickTextOptions): Promise<PickTextResult>;
  cloneRepo(url: string, parentDir: string, folderName: string): Promise<CloneRepoResult>;
  pickDir(options?: PickDirOptions): Promise<PickDirResult>;
  pickText(options?: PickTextOptions): Promise<PickTextResult>;
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
