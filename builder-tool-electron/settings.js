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

// Takes a stored record ({ path }) and decorates it for the renderer.
function toProject(entry) {
  return {
    path: entry.path,
    name: path.basename(entry.path),
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

module.exports = { loadProjects, saveProjects, setProjectDeploy, toProject };
