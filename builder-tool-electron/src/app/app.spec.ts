import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App } from './app';
import { ProjectService } from './project.service';
import {
  AddProjectResult,
  Project,
  RunEvent,
  SetDeployResult,
  StartRunResult
} from './electron-api';

class ProjectServiceStub {
  projects: Project[] = [];
  lastRun: { projectPath: string; script: string } | null = null;
  lastDeploy: string | null = null;
  lastDeployDir: string | null = null;
  removedPaths: string[] = [];
  runEventHandler: ((event: RunEvent) => void) | null = null;

  listProjects(): Promise<Project[]> {
    return Promise.resolve(this.projects);
  }

  addProject(): Promise<AddProjectResult> {
    return Promise.resolve({ canceled: true, added: false });
  }

  removeProject(projectPath: string): Promise<boolean> {
    this.removedPaths.push(projectPath);
    return Promise.resolve(true);
  }

  setDeployDir(projectPath: string): Promise<SetDeployResult> {
    this.lastDeployDir = projectPath;
    const entry = this.projects.find((candidate) => candidate.path === projectPath);
    if (!entry) {
      return Promise.resolve({ canceled: true, set: false });
    }
    return Promise.resolve({ canceled: false, set: true, project: { ...entry, deployTo: 'C:/out' } });
  }

  runScript(projectPath: string, script: string): Promise<StartRunResult> {
    this.lastRun = { projectPath, script };
    return Promise.resolve({ started: true, runId: 1 });
  }

  startDeploy(projectPath: string): Promise<StartRunResult> {
    this.lastDeploy = projectPath;
    return Promise.resolve({ started: true, runId: 2 });
  }

  cancelRun(): Promise<{ canceled: boolean }> {
    return Promise.resolve({ canceled: true });
  }

  runningRunId(): Promise<number | null> {
    return Promise.resolve(null);
  }

  onRunEvent(callback: (event: RunEvent) => void): () => void {
    this.runEventHandler = callback;
    return () => {
      this.runEventHandler = null;
    };
  }
}

describe('App', () => {
  let service: ProjectServiceStub;

  beforeEach(async () => {
    service = new ProjectServiceStub();
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [{ provide: ProjectService, useValue: service }]
    }).compileComponents();
  });

  async function render(): Promise<ComponentFixture<App>> {
    const fixture = TestBed.createComponent(App);
    // ngOnInit only runs on the first detectChanges, so settle afterwards.
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture;
  }

  function elementOf(fixture: ComponentFixture<App>): HTMLElement {
    return fixture.nativeElement as HTMLElement;
  }

  function button(fixture: ComponentFixture<App>, label: string): HTMLButtonElement | null {
    const match = Array.from(
      elementOf(fixture).querySelectorAll<HTMLButtonElement>('button')
    ).find((candidate) => candidate.textContent?.trim() === label);
    return match ?? null;
  }

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the header', async () => {
    const fixture = await render();
    expect(elementOf(fixture).querySelector('h1')?.textContent).toContain('Builder Tool');
  });

  it('should prompt the user to add a project when the list is empty', async () => {
    const fixture = await render();
    expect(elementOf(fixture).textContent).toContain('Add project');
  });

  it('should list saved projects', async () => {
    service.projects = [
      { path: 'C:/work/app-one', name: 'app-one', hasPackageJson: true, deployTo: null },
      { path: 'C:/work/app-two', name: 'app-two', hasPackageJson: true, deployTo: null }
    ];
    const fixture = await render();
    expect(elementOf(fixture).querySelectorAll('.project-card').length).toBe(2);
    expect(elementOf(fixture).textContent).toContain('app-one');
    expect(elementOf(fixture).textContent).toContain('C:/work/app-two');
  });

  it('should warn and disable run actions for folders without a package.json', async () => {
    service.projects = [{ path: 'C:/work/empty', name: 'empty', hasPackageJson: false, deployTo: null }];
    const fixture = await render();
    expect(elementOf(fixture).textContent).toContain('No package.json in this folder.');
    expect(button(fixture, 'Install')?.disabled).toBe(true);
    expect(button(fixture, 'Build')?.disabled).toBe(true);
    expect(button(fixture, 'Remove')?.disabled).toBe(false);
  });

  it('should require a second click before removing a project', async () => {
    service.projects = [{ path: 'C:/work/app-one', name: 'app-one', hasPackageJson: true, deployTo: null }];
    const fixture = await render();

    button(fixture, 'Remove')?.click();
    fixture.detectChanges();
    expect(service.removedPaths.length).toBe(0);
    expect(button(fixture, 'Confirm')).not.toBeNull();

    button(fixture, 'Confirm')?.click();
    await fixture.whenStable();
    expect(service.removedPaths).toEqual(['C:/work/app-one']);
  });

  it('should run the install action for the selected project', async () => {
    service.projects = [{ path: 'C:/work/app-one', name: 'app-one', hasPackageJson: true, deployTo: null }];
    const fixture = await render();
    button(fixture, 'Install')?.click();
    await fixture.whenStable();
    expect(service.lastRun).toEqual({ projectPath: 'C:/work/app-one', script: 'install' });
  });

  it('should stream output and clear the running state on exit', async () => {
    service.projects = [{ path: 'C:/work/app-one', name: 'app-one', hasPackageJson: true, deployTo: null }];
    const fixture = await render();

    button(fixture, 'Build')?.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.activeRun?.command).toBe('npm run build');

    service.runEventHandler?.({
      type: 'started',
      runId: 1,
      projectPath: 'C:/work/app-one',
      script: 'build',
      command: 'npm run build'
    });
    service.runEventHandler?.({ type: 'stdout', runId: 1, line: 'building...' });
    service.runEventHandler?.({ type: 'stderr', runId: 1, line: 'a warning' });
    service.runEventHandler?.({ type: 'exit', runId: 1, code: 0 });
    fixture.detectChanges();

    const text = elementOf(fixture).textContent ?? '';
    expect(text).toContain('$ npm run build');
    expect(text).toContain('building...');
    expect(text).toContain('a warning');
    expect(text).toContain('Finished successfully.');
    expect(fixture.componentInstance.activeRun).toBeNull();
  });

  it('should ignore events belonging to a different run', async () => {
    service.projects = [{ path: 'C:/work/app-one', name: 'app-one', hasPackageJson: true, deployTo: null }];
    const fixture = await render();

    button(fixture, 'Build')?.click();
    await fixture.whenStable();

    service.runEventHandler?.({ type: 'stdout', runId: 99, line: 'stale output' });
    fixture.detectChanges();

    expect(elementOf(fixture).textContent).not.toContain('stale output');
  });

  it('should buffer events that arrive before the run id is known', async () => {
    service.projects = [{ path: 'C:/work/app-one', name: 'app-one', hasPackageJson: true, deployTo: null }];
    const fixture = await render();

    button(fixture, 'Build')?.click();
    // Simulates the main process emitting before the invoke reply lands.
    service.runEventHandler?.({ type: 'stdout', runId: 1, line: 'early line' });
    await fixture.whenStable();
    fixture.detectChanges();

    expect(elementOf(fixture).textContent).toContain('early line');
  });

  it('should show when no deploy destination is set and keep Deploy disabled', async () => {
    service.projects = [{ path: 'C:/work/app-one', name: 'app-one', hasPackageJson: true, deployTo: null }];
    const fixture = await render();

    expect(elementOf(fixture).textContent).toContain('No deploy destination');
    expect(button(fixture, 'Deploy')?.disabled).toBe(true);
    expect(button(fixture, 'Set…')?.disabled).toBe(false);
  });

  it('should store a deploy destination and enable Deploy', async () => {
    service.projects = [{ path: 'C:/work/app-one', name: 'app-one', hasPackageJson: true, deployTo: null }];
    const fixture = await render();

    button(fixture, 'Set…')?.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(service.lastDeployDir).toBe('C:/work/app-one');
    expect(elementOf(fixture).textContent).toContain('C:/out');
    expect(button(fixture, 'Deploy')?.disabled).toBe(false);
  });

  it('should deploy the built app to the configured destination', async () => {
    service.projects = [
      { path: 'C:/work/app-one', name: 'app-one', hasPackageJson: true, deployTo: 'C:/out' }
    ];
    const fixture = await render();

    button(fixture, 'Deploy')?.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(service.lastDeploy).toBe('C:/work/app-one');
    expect(fixture.componentInstance.activeRun?.command).toBe('deploy → C:/out');
  });
});
