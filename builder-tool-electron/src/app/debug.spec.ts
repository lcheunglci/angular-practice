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

class Stub {
  projects: Project[] = [];
  lastUpdate: { projectPath: string; changes: ProjectChanges } | null = null;
  updateResult: UpdateProjectResult | null = null;
  listProjects(): Promise<Project[]> {
    return Promise.resolve(this.projects);
  }
  addProject(): Promise<AddProjectResult> {
    return Promise.resolve({ canceled: true, added: false });
  }
  removeProject(): Promise<boolean> {
    return Promise.resolve(true);
  }
  updateProject(p: string, c: ProjectChanges): Promise<UpdateProjectResult> {
    this.lastUpdate = { projectPath: p, changes: c };
    if (this.updateResult) return Promise.resolve(this.updateResult);
    const e = this.projects.find((x) => x.path === p)!;
    return Promise.resolve({
      updated: true,
      project: { ...e, name: c.name ?? e.name, path: c.path ?? e.path, deployTo: c.deployTo || null }
    });
  }
  setDeployDir(): Promise<SetDeployResult> {
    return Promise.resolve({ canceled: true, set: false });
  }
  runScript(): Promise<StartRunResult> {
    return Promise.resolve({ started: true, runId: 1 });
  }
  startDeploy(): Promise<StartRunResult> {
    return Promise.resolve({ started: true, runId: 2 });
  }
  cancelRun(): Promise<{ canceled: boolean }> {
    return Promise.resolve({ canceled: true });
  }
  runningRunId(): Promise<number | null> {
    return Promise.resolve(null);
  }
  onRunEvent(_c: (e: RunEvent) => void): () => void {
    return () => {};
  }
}

describe('DEBUG cancel', () => {
  let service: Stub;

  beforeEach(async () => {
    service = new Stub();
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [{ provide: ProjectService, useValue: service }]
    }).compileComponents();
  });

  it('inspect', async () => {
    service.projects = [
      { path: 'C:/work/app-one', name: 'app-one', hasPackageJson: true, deployTo: 'C:/out/one' }
    ];
    const fixture: ComponentFixture<App> = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const btn = (label: string) =>
      Array.from(fixture.nativeElement.querySelectorAll('button')).find(
        (b) => (b as HTMLButtonElement).textContent?.trim() === label
      ) as HTMLButtonElement | undefined;
    const input = () =>
      fixture.nativeElement.querySelector('.edit-grid input') as HTMLInputElement;
    const app = fixture.componentInstance;

    btn('Edit')?.click();
    fixture.detectChanges();
    console.log('AFTER EDIT  dom=', input().value, 'draft=', JSON.stringify(app.drafts));

    input().value = 'renamed';
    input().dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await new Promise((r) => setTimeout(r, 0));
    console.log('AFTER TYPE  dom=', input().value, 'draft=', JSON.stringify(app.drafts));

    btn('Cancel')?.click();
    fixture.detectChanges();
    await new Promise((r) => setTimeout(r, 0));
    fixture.detectChanges();
    await new Promise((r) => setTimeout(r, 0));
    console.log('AFTER CANCEL dom=', input().value, 'draft=', JSON.stringify(app.drafts));
    expect(true).toBeTrue();
  });
});