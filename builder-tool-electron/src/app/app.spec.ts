import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App } from './app';
import { ProjectService } from './project.service';
import {
  AddProjectResult,
  Project,
  ProjectChanges,
  RunEvent,
  SetDeployResult,
  StartRunResult,
  UpdateProjectResult
} from './electron-api';

class ProjectServiceStub {
  projects: Project[] = [];
  lastRun: { projectPath: string; script: string } | null = null;
  lastDeploy: string | null = null;
  lastDeployDir: string | null = null;
  lastUpdate: { projectPath: string; changes: ProjectChanges } | null = null;
  updateResult: UpdateProjectResult | null = null;
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

  updateProject(projectPath: string, changes: ProjectChanges): Promise<UpdateProjectResult> {
    this.lastUpdate = { projectPath, changes };
    if (this.updateResult) {
      return Promise.resolve(this.updateResult);
    }
    const entry = this.projects.find((candidate) => candidate.path === projectPath);
    if (!entry) {
      return Promise.resolve({ updated: false, reason: 'Project is not in the saved list.' });
    }
    return Promise.resolve({
      updated: true,
      project: {
        ...entry,
        name: changes.name ?? entry.name,
        path: changes.path ?? entry.path,
        deployTo: changes.deployTo ? changes.deployTo : null
      }
    });
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

  it('should show a failure banner when the build exits non-zero', async () => {
    service.projects = [{ path: 'C:/work/app-one', name: 'app-one', hasPackageJson: true, deployTo: null }];
    const fixture = await render();

    button(fixture, 'Build')?.click();
    await fixture.whenStable();

    service.runEventHandler?.({
      type: 'started',
      runId: 1,
      projectPath: 'C:/work/app-one',
      script: 'build',
      command: 'npm run build'
    });
    service.runEventHandler?.({ type: 'exit', runId: 1, code: 1 });
    fixture.detectChanges();

    const banner = elementOf(fixture).querySelector('.alert-danger');
    expect(banner?.textContent).toContain('Build failed');
    expect(banner?.textContent).toContain('Exit code 1');
  });

  it('should show a success banner when the build exits zero', async () => {
    service.projects = [{ path: 'C:/work/app-one', name: 'app-one', hasPackageJson: true, deployTo: null }];
    const fixture = await render();

    button(fixture, 'Build')?.click();
    await fixture.whenStable();

    service.runEventHandler?.({ type: 'exit', runId: 1, code: 0 });
    fixture.detectChanges();

    const banner = elementOf(fixture).querySelector('.alert-success');
    expect(banner?.textContent).toContain('Build succeeded');
    expect(elementOf(fixture).querySelector('.alert-danger')).toBeNull();
  });

  it('should show a failure banner for an error event', async () => {
    service.projects = [
      { path: 'C:/work/app-one', name: 'app-one', hasPackageJson: true, deployTo: 'C:/out' }
    ];
    const fixture = await render();

    button(fixture, 'Deploy')?.click();
    await fixture.whenStable();

    service.runEventHandler?.({
      type: 'error',
      runId: 2,
      message: 'No build output found under "dist". Run Build first.'
    });
    fixture.detectChanges();

    const banner = elementOf(fixture).querySelector('.alert-danger');
    expect(banner?.textContent).toContain('Deploy failed');
    expect(banner?.textContent).toContain('No build output found');
  });

  it('should dismiss the banner on request', async () => {
    service.projects = [{ path: 'C:/work/app-one', name: 'app-one', hasPackageJson: true, deployTo: null }];
    const fixture = await render();

    button(fixture, 'Build')?.click();
    await fixture.whenStable();
    service.runEventHandler?.({ type: 'exit', runId: 1, code: 1 });
    fixture.detectChanges();
    expect(elementOf(fixture).querySelector('.alert-danger')).not.toBeNull();

    button(fixture, 'Dismiss')?.click();
    fixture.detectChanges();
    expect(elementOf(fixture).querySelector('.alert-danger')).toBeNull();
  });

  it('should clear the banner when the next run starts', async () => {
    service.projects = [{ path: 'C:/work/app-one', name: 'app-one', hasPackageJson: true, deployTo: null }];
    const fixture = await render();

    button(fixture, 'Build')?.click();
    await fixture.whenStable();
    service.runEventHandler?.({ type: 'exit', runId: 1, code: 1 });
    fixture.detectChanges();
    expect(elementOf(fixture).querySelector('.alert-danger')).not.toBeNull();

    button(fixture, 'Build')?.click();
    fixture.detectChanges();

    expect(elementOf(fixture).querySelector('.alert-danger')).toBeNull();
  });

  it('should show the spinner and progress strip while a run is active', async () => {
    service.projects = [{ path: 'C:/work/app-one', name: 'app-one', hasPackageJson: true, deployTo: null }];
    const fixture = await render();

    expect(elementOf(fixture).querySelector('.spinner-border')).toBeNull();
    expect(elementOf(fixture).querySelector('.console-progress')).toBeNull();
    expect(elementOf(fixture).textContent).toContain('Idle');

    button(fixture, 'Build')?.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(elementOf(fixture).querySelector('.spinner-border')).not.toBeNull();
    expect(
      elementOf(fixture).querySelector('.progress-bar-animated')
    ).not.toBeNull();
    expect(elementOf(fixture).textContent).toContain('npm run build');

    service.runEventHandler?.({ type: 'exit', runId: 1, code: 0 });
    fixture.detectChanges();

    expect(elementOf(fixture).querySelector('.spinner-border')).toBeNull();
    expect(elementOf(fixture).querySelector('.console-progress')).toBeNull();
  });

  it('should show the spinner while starting, before the run id arrives', async () => {
    service.projects = [{ path: 'C:/work/app-one', name: 'app-one', hasPackageJson: true, deployTo: null }];
    let resolveStart!: (result: StartRunResult) => void;
    service.runScript = () =>
      new Promise<StartRunResult>((resolve) => {
        resolveStart = resolve;
      });

    const fixture = await render();
    button(fixture, 'Install')?.click();
    fixture.detectChanges();

    // The invoke reply has not landed yet, but the run is clearly in flight.
    expect(elementOf(fixture).querySelector('.spinner-border')).not.toBeNull();
    expect(elementOf(fixture).textContent).toContain('Starting…');
    expect(elementOf(fixture).textContent).not.toContain('Idle');

    resolveStart({ started: true, runId: 1 });
    await fixture.whenStable();
    fixture.detectChanges();
    expect(elementOf(fixture).textContent).not.toContain('Starting…');
  });

  it('should show the spinner while deploying', async () => {
    service.projects = [
      { path: 'C:/work/app-one', name: 'app-one', hasPackageJson: true, deployTo: 'C:/out' }
    ];
    const fixture = await render();

    button(fixture, 'Deploy')?.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(elementOf(fixture).querySelector('.spinner-border')).not.toBeNull();
    expect(elementOf(fixture).textContent).toContain('deploy → C:/out');
  });

  describe('edit mode', () => {
    async function renderEditable(): Promise<ComponentFixture<App>> {
      service.projects = [
        {
          path: 'C:/work/app-one',
          name: 'app-one',
          hasPackageJson: true,
          deployTo: 'C:/out/one'
        },
        { path: 'C:/work/app-two', name: 'app-two', hasPackageJson: true, deployTo: null }
      ];
      const fixture = await render();
      button(fixture, 'Edit')?.click();
      fixture.detectChanges();
      return fixture;
    }

    // Rebuilding a row's inputs is synchronous, but a save resolves a promise
    // first, so both are needed before reading the DOM.
    async function settle(fixture: ComponentFixture<App>): Promise<void> {
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
    }

    function inputs(fixture: ComponentFixture<App>): HTMLInputElement[] {
      return Array.from(elementOf(fixture).querySelectorAll<HTMLInputElement>('.edit-grid input'));
    }

    function type(input: HTMLInputElement, value: string): void {
      input.value = value;
      input.dispatchEvent(new Event('input'));
    }

    it('should switch every row to textboxes when edit mode turns on', async () => {
      const fixture = await renderEditable();

      expect(elementOf(fixture).querySelectorAll('.project-card').length).toBe(2);
      // Three fields per row.
      expect(inputs(fixture).length).toBe(6);
      expect(inputs(fixture)[0].value).toBe('app-one');
      expect(inputs(fixture)[1].value).toBe('C:/work/app-one');
      expect(inputs(fixture)[2].value).toBe('C:/out/one');
      expect(inputs(fixture)[3].value).toBe('app-two');
      // Read-only markup is gone while editing.
      // Run controls are hidden while every row is being edited.
      expect(button(fixture, 'Build')).toBeNull();
      expect(button(fixture, 'Deploy')).toBeNull();
      expect(elementOf(fixture).querySelector('.deploy-row')).toBeNull();
    });

    it('should show the saved destination on a row that is not being edited', async () => {
      const fixture = await renderEditable();
      // Cancelling row 0 returns it to read-only, where its destination shows.
      button(fixture, 'Cancel')?.click();
      await settle(fixture);

      expect(elementOf(fixture).querySelector('.deploy-row')?.textContent).toContain(
        'C:/out/one'
      );
    });

    it('should offer a Done button and discard drafts when leaving edit mode', async () => {
      const fixture = await renderEditable();
      type(inputs(fixture)[0], 'renamed');

      button(fixture, 'Done')?.click();
      fixture.detectChanges();

      expect(inputs(fixture).length).toBe(0);
      expect(elementOf(fixture).textContent).toContain('app-one');
      expect(elementOf(fixture).textContent).not.toContain('renamed');
      expect(service.lastUpdate).toBeNull();
    });

    it('should save the edited fields and refresh the row', async () => {
      const fixture = await renderEditable();
      type(inputs(fixture)[0], 'renamed');
      type(inputs(fixture)[2], 'C:/out/two');

      button(fixture, 'Save')?.click();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(service.lastUpdate).toEqual({
        projectPath: 'C:/work/app-one',
        changes: { name: 'renamed', path: 'C:/work/app-one', deployTo: 'C:/out/two' }
      });

      // The saved row leaves edit state, so the values show as text again.
      expect(inputs(fixture).length).toBe(3);
      expect(elementOf(fixture).textContent).toContain('renamed');
      expect(elementOf(fixture).textContent).toContain('C:/out/two');
    });

    it('should re-key a row that moved to a new folder', async () => {
      const fixture = await renderEditable();
      type(inputs(fixture)[1], 'C:/work/renamed-folder');

      button(fixture, 'Save')?.click();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(elementOf(fixture).textContent).toContain('C:/work/renamed-folder');
      // Only the untouched second row is still being edited.
      expect(inputs(fixture).length).toBe(3);
      expect(inputs(fixture)[0].value).toBe('app-two');
    });

    it('should show the failure reason on the row and keep the row editable', async () => {
      service.updateResult = {
        updated: false,
        reason: 'Another project already uses that folder.'
      };
      const fixture = await renderEditable();
      type(inputs(fixture)[1], 'C:/work/app-two');

      button(fixture, 'Save')?.click();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(elementOf(fixture).querySelector('.row-error')?.textContent).toContain(
        'Another project already uses that folder.'
      );
      expect(inputs(fixture).length).toBe(6);
      expect(inputs(fixture)[1].value).toBe('C:/work/app-two');
    });

    it('should discard the typed values when a row is cancelled', async () => {
      const fixture = await renderEditable();
      type(inputs(fixture)[0], 'renamed');
      type(inputs(fixture)[2], 'C:/out/two');

      button(fixture, 'Cancel')?.click();
      await settle(fixture);

      // The row leaves edit state, which destroys its inputs, so no typed text
      // can survive the reset.
      expect(inputs(fixture).length).toBe(3);
      expect(elementOf(fixture).textContent).toContain('app-one');
      expect(elementOf(fixture).textContent).toContain('C:/out/one');
      expect(elementOf(fixture).textContent).not.toContain('renamed');
      expect(service.lastUpdate).toBeNull();
    });

    it('should clear the deploy destination when the field is emptied', async () => {
      const fixture = await renderEditable();
      type(inputs(fixture)[2], '');

      button(fixture, 'Save')?.click();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(service.lastUpdate?.changes.deployTo).toBe('');
      expect(elementOf(fixture).textContent).toContain('No deploy destination');
    });

    it('should let a single row be reopened after cancelling', async () => {
      const fixture = await renderEditable();
      button(fixture, 'Cancel')?.click();
      await settle(fixture);

      // Row 0 now shows text plus an Edit button that reopens its fields.
      expect(button(fixture, 'Edit')?.textContent?.trim()).toBe('Edit');
      const rowEditButtons = Array.from(
        elementOf(fixture).querySelectorAll<HTMLButtonElement>('.project-card button')
      ).filter((candidate) => candidate.textContent?.trim() === 'Edit');
      expect(rowEditButtons.length).toBe(1);
      rowEditButtons[0].click();
      await settle(fixture);

      expect(inputs(fixture).length).toBe(6);
      expect(inputs(fixture)[0].value).toBe('app-one');
    });

    it('should not run a command while in edit mode', async () => {
      const fixture = await renderEditable();
      expect(button(fixture, 'Build')).toBeNull();
      expect(button(fixture, 'Install')).toBeNull();
      expect(button(fixture, 'Add project')?.disabled).toBeTrue();
    });
  });
});
