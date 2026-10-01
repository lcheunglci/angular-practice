const fs = require('node:fs/promises');
const path = require('node:path');

// Resolves the folder that holds the built app for a project. Angular 20's
// `@angular/build:application` writes to <project>/dist/<name>/browser (among
// other folders), older builds write to <project>/dist/<name>, and a few tools
// write directly into <project>/dist. The built app is the folder that
// contains an index.html, preferring a `browser` subfolder.
async function resolveBuildOutput(projectPath) {
  const dist = path.join(projectPath, 'dist');
  await fs.access(dist);

  const hits = [];
  async function walk(dir, depth) {
    if (depth > 4 || hits.length) return;
    let items = [];
    try {
      items = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    if (items.some((item) => item.isFile() && item.name === 'index.html')) {
      hits.push(dir);
      return;
    }
    for (const item of items) {
      if (item.isDirectory()) {
        await walk(path.join(dir, item.name), depth + 1);
      }
    }
  }
  await walk(dist, 0);
  if (!hits.length) return null;
  return (
    hits.find((candidate) => path.basename(candidate) === 'browser') ??
    hits.sort((a, b) => a.length - b.length)[0]
  );
}

// True when the destination sits inside the source (copying into ourselves).
function isInside(src, dest) {
  const relative = path.relative(src, dest);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

async function dirBytes(dir) {
  let total = 0;
  const items = await fs.readdir(dir, { withFileTypes: true });
  for (const item of items) {
    const full = path.join(dir, item.name);
    total += item.isDirectory() ? await dirBytes(full) : (await fs.stat(full)).size;
  }
  return total;
}

// Copies the *contents* of src into dest (dest may be created), so index.html
// lands directly in dest. Overwrites existing files. Checks `shouldAbort()`
// between entries so a cancel stops the copy early.
async function copyDeployment(src, dest, shouldAbort = () => false) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  let copiedItems = 0;
  for (const item of entries) {
    if (shouldAbort()) {
      throw new Error('Deploy canceled.');
    }
    const from = path.join(src, item.name);
    const to = path.join(dest, item.name);
    await fs.cp(from, to, { recursive: true, force: true });
    copiedItems++;
  }
  const bytes = await dirBytes(dest);
  return { copiedItems, bytes };
}

module.exports = { resolveBuildOutput, isInside, copyDeployment };