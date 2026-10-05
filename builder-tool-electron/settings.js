const fs = require('fs');
const path = require('path');
const { app } = require('electron');

function settingsFile() {
  return path.join(app.getPath('userData'), 'projects.json');
}

function loadProjects() {
  try {
    const raw = fs.readFileSync(settingsFile(), 'utf8');
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((entry) => entry && typeof entry.path === 'string');
  } catch {
    return [];
  }
}

function saveProjects(projects) {
  fs.mkdirSync(path.dirname(settingsFile()), { recursive: true });
  fs.writeFileSync(settingsFile(), JSON.stringify(projects, null, 2), 'utf8');
}

function isDirectory(candidate) {
  try {
    return fs.statSync(candidate).isDirectory();
  } catch {
    return false;
  }
}

// Takes a stored record and decorates it for the renderer. `name` is stored
// once the user edits it, otherwise it falls back to the folder name.
function toProject(entry) {
  return {
    path: entry.path,
    name: entry.name || path.basename(entry.path),
    hasPackageJson: fs.existsSync(path.join(entry.path, 'package.json')),
    deployTo: entry.deployTo || null
  };
}

// Stores (or clears) the deploy destination for a project record.
function setProjectDeploy(projectPath, deployTo) {
  const projects = loadProjects();
  const entry = projects.find((candidate) => candidate.path === projectPath);
  if (!entry) return false;
  entry.deployTo = deployTo || null;
  saveProjects(projects);
  return true;
}

// Applies edited fields (name, folder, deploy destination) to a record. The
// folder is the record's identity, so it needs the same duplicate check the
// add flow uses. Returns { updated, reason?, project? } rather than throwing,
// because each reason is shown next to the row being edited.
function updateProject(originalPath, changes) {
  const projects = loadProjects();
  const entry = projects.find((candidate) => candidate.path === originalPath);
  if (!entry) {
    return { updated: false, reason: 'Project is not in the saved list.' };
  }

  const nextPath = typeof changes.path === 'string' ? changes.path.trim() : entry.path;
  if (!nextPath) {
    return { updated: false, reason: 'Project folder cannot be empty.' };
  }
  if (!path.isAbsolute(nextPath)) {
    return { updated: false, reason: 'Project folder must be an absolute path.' };
  }
  if (!isDirectory(nextPath)) {
    return { updated: false, reason: `Project folder does not exist: ${nextPath}` };
  }
  if (projects.some((other) => other.path === nextPath && other.path !== originalPath)) {
    return { updated: false, reason: 'Another project already uses that folder.' };
  }

  // An empty destination clears it, which is how a row drops its deploy target.
  const deployTo = typeof changes.deployTo === 'string' ? changes.deployTo.trim() : entry.deployTo;
  if (deployTo) {
    if (!path.isAbsolute(deployTo)) {
      return { updated: false, reason: 'Deploy destination must be an absolute path.' };
    }
    if (!isDirectory(deployTo)) {
      return { updated: false, reason: `Deploy destination does not exist: ${deployTo}` };
    }
  }

  const name = typeof changes.name === 'string' ? changes.name.trim() : '';
  entry.path = nextPath;
  // Blank name falls back to the folder name so the row is never nameless.
  entry.name = name || path.basename(nextPath);
  entry.deployTo = deployTo || null;
  saveProjects(projects);
  return { updated: true, project: toProject(entry) };
}

module.exports = { loadProjects, saveProjects, setProjectDeploy, updateProject, toProject };
