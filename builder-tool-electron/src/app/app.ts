import {
  Component,
  DestroyRef,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
  inject
} from '@angular/core';
import { BuildScript, Project, RunAction, RunEvent } from './electron-api';
import { ProjectService } from './project.service';

interface LogLine {
  kind: 'stdout' | 'stderr' | 'info';
  text: string;
}

interface ActiveRun {
  runId: number;
  projectPath: string;
  projectName: string;
  script: RunAction;
  command: string;
}

interface RunNotice {
  status: 'success' | 'failed';
  title: string;
  detail: string;
}

const MAX_LOG_LINES = 2000;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  @ViewChild('consoleView') consoleView?: ElementRef<HTMLDivElement>;

  projects: Project[] = [];
  logLines: LogLine[] = [];
  activeRun: ActiveRun | null = null;
  notice: RunNotice | null = null;
  confirmRemovePath: string | null = null;
  error = '';
  loading = true;

  private readonly projectService = inject(ProjectService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly ngZone = inject(NgZone);

  // `run:start` replies over the invoke channel while output arrives over the
  // event channel, so early events are buffered until the run id is known.
  private runStarting = false;
  private pendingEvents: RunEvent[] = [];

  constructor() {
    // IPC `run:event` delivery fires outside Angular's zone, so run the handler
    // inside the zone to trigger change detection for each streamed line.
    this.destroyRef.onDestroy(
      this.projectService.onRunEvent((event) => this.ngZone.run(() => this.handleRunEvent(event)))
    );
  }

  get busy(): boolean {
    return this.activeRun !== null || this.runStarting;
  }

  ngOnInit(): void {
    void this.refresh();
  }

  async refresh(): Promise<void> {
    this.loading = true;
    this.error = '';
    try {
      this.projects = await this.projectService.listProjects();
    } catch (err) {
      this.error = String(err);
    } finally {
      this.loading = false;
    }
  }

  async addProject(): Promise<void> {
    this.error = '';
    try {
      const result = await this.projectService.addProject();
      if (result.canceled) return;
      if (!result.added) {
        this.error = result.reason ?? 'Project could not be added.';
        return;
      }
      await this.refresh();
    } catch (err) {
      this.error = String(err);
    }
  }

  askRemove(project: Project): void {
    this.confirmRemovePath = project.path;
  }

  cancelRemove(): void {
    this.confirmRemovePath = null;
  }

  async remove(project: Project): Promise<void> {
    this.confirmRemovePath = null;
    this.error = '';
    try {
      await this.projectService.removeProject(project.path);
      await this.refresh();
    } catch (err) {
      this.error = String(err);
    }
  }

  async setDeployDir(project: Project): Promise<void> {
    this.error = '';
    try {
      const result = await this.projectService.setDeployDir(project.path);
      if (result.canceled) return;
      if (!result.set) {
        this.error = result.reason ?? 'Deploy destination could not be set.';
        return;
      }
      const updated = result.project;
      if (updated) {
        this.projects = this.projects.map(
          (entry) => (entry.path === updated.path ? updated : entry)
        );
      }
    } catch (err) {
      this.error = String(err);
    }
  }

  async run(project: Project, script: RunAction): Promise<void> {
    this.error = '';
    this.logLines = [];
    // The previous outcome is stale once a new run begins.
    this.notice = null;
    this.runStarting = true;
    try {
      const isDeploy = script === 'deploy';
      const result = isDeploy
        ? await this.projectService.startDeploy(project.path)
        : await this.projectService.runScript(project.path, script as BuildScript);
      if (!result.started || result.runId === undefined) {
        this.error = result.reason ?? 'Command could not be started.';
        return;
      }
      this.activeRun = {
        runId: result.runId,
        projectPath: project.path,
        projectName: project.name,
        script,
        command:
          isDeploy && project.deployTo
            ? `deploy → ${project.deployTo}`
            : script === 'install'
              ? 'npm install'
              : script === 'build'
                ? 'npm run build'
                : 'deploy'
      };
      this.flushPendingEvents();
    } catch (err) {
      this.error = String(err);
    } finally {
      this.runStarting = false;
    }
  }

  async cancel(): Promise<void> {
    if (!this.activeRun) return;
    try {
      await this.projectService.cancelRun(this.activeRun.runId);
    } catch (err) {
      this.error = String(err);
    }
  }

  clearLog(): void {
    this.logLines = [];
    this.error = '';
  }

  private handleRunEvent(event: RunEvent): void {
    if (!this.activeRun) {
      if (this.runStarting) {
        this.pendingEvents.push(event);
      }
      return;
    }
    if (event.runId !== this.activeRun.runId) {
      return;
    }
    this.applyRunEvent(event);
  }

  private flushPendingEvents(): void {
    const buffered = this.pendingEvents;
    this.pendingEvents = [];
    for (const event of buffered) {
      if (this.activeRun && event.runId === this.activeRun.runId) {
        this.applyRunEvent(event);
      }
    }
  }

  private applyRunEvent(event: RunEvent): void {
    switch (event.type) {
      case 'started':
        this.notice = null;
        this.append('info', `$ ${event.command}`);
        this.append('info', `in ${event.projectPath}`);
        this.scrollToBottom();
        break;
      case 'stdout':
        this.append('stdout', event.line);
        break;
      case 'stderr':
        this.append('stderr', event.line);
        break;
      case 'error':
        this.append('stderr', event.message);
        this.notice = {
          status: 'failed',
          title: `${this.actionLabel(this.activeRun?.script)} failed`,
          detail: event.message
        };
        this.activeRun = null;
        break;
      case 'exit':
        this.append(
          'info',
          event.code === 0 ? 'Finished successfully.' : `Exited with code ${event.code}.`
        );
        this.notice = {
          status: event.code === 0 ? 'success' : 'failed',
          title:
            event.code === 0
              ? `${this.actionLabel(this.activeRun?.script)} succeeded`
              : `${this.actionLabel(this.activeRun?.script)} failed`,
          detail:
            event.code === 0
              ? 'Exit code 0.'
              : `Exit code ${event.code}. See the console for details.`
        };
        this.activeRun = null;
        this.scrollToBottom();
        break;
    }
  }

  private actionLabel(script?: string): string {
    return script === 'install' ? 'Install' : script === 'deploy' ? 'Deploy' : 'Build';
  }

  dismissNotice(): void {
    this.notice = null;
  }

  private append(kind: LogLine['kind'], text: string): void {
    this.logLines.push({ kind, text });
    if (this.logLines.length > MAX_LOG_LINES) {
      this.logLines.splice(0, this.logLines.length - MAX_LOG_LINES);
    }
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const element = this.consoleView?.nativeElement;
      if (element) {
        element.scrollTop = element.scrollHeight;
      }
    });
  }
}
