const zlib = require('node:zlib');
const { Tray, Menu, BrowserWindow, Notification, nativeImage, app } = require('electron');

// The tray is generated instead of shipped as a binary asset: a tiny PNG writer
// keeps the repo asset-free and lets each state carry its own color.

const SIZE = 16;

const STATES = {
  idle: { fill: [108, 117, 125], border: [73, 80, 87], glyph: 'minus' },
  running: { fill: [13, 110, 253], border: [10, 88, 202], glyph: 'play' },
  success: { fill: [25, 135, 84], border: [20, 108, 67], glyph: 'check' },
  failed: { fill: [220, 53, 69], border: [176, 42, 55], glyph: 'bang' }
};

let crcTable = null;
function crc32(buf) {
  if (!crcTable) {
    crcTable = new Int32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      crcTable[n] = c;
    }
  }
  let crc = -1;
  for (let i = 0; i < buf.length; i++) crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ -1) >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const typed = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typed), 0);
  return Buffer.concat([length, typed, crc]);
}

function encodePng(pixels, size) {
  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0; // filter: none
    pixels.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // colour type: RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

function disc(pixels, size, cx, cy, radius, color, soft = true) {
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const distance = Math.hypot(x + 0.5 - cx, y + 0.5 - cy);
      // The outer circle gets a one-pixel soft edge, but glyph strokes stay
      // fully opaque: at 16px a 1px line anti-aliased on both sides reads as a
      // faint smudge instead of a shape.
      const alpha = soft ? Math.max(0, Math.min(1, radius + 0.5 - distance)) : distance <= radius ? 1 : 0;
      if (alpha <= 0) continue;
      const index = (y * size + x) * 4;
      pixels[index] = color[0];
      pixels[index + 1] = color[1];
      pixels[index + 2] = color[2];
      pixels[index + 3] = Math.round(255 * alpha);
    }
  }
}

function stroke(pixels, size, points, radius, color) {
  for (let i = 0; i < points.length - 1; i++) {
    const [x0, y0] = points[i];
    const [x1, y1] = points[i + 1];
    const steps = Math.ceil(Math.hypot(x1 - x0, y1 - y0) * 3) + 1;
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      disc(pixels, size, x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, radius, color, false);
    }
  }
}

const WHITE = [255, 255, 255];

function glyphPaths(glyph) {
  switch (glyph) {
    case 'check':
      return [[[4.5, 8.2], [7, 10.6], [11.8, 5.2]]];
    case 'bang':
      return [[[8, 3.6], [8, 8.4]], [[8, 10.4], [8, 11.6]]];
    case 'play':
      return [[[5.6, 4.2], [11.6, 8], [5.6, 11.8]]];
    default:
      return [[[5.4, 8], [10.6, 8]]];
  }
}

function renderIcon(state) {
  const style = STATES[state] ?? STATES.idle;
  const pixels = Buffer.alloc(SIZE * SIZE * 4);
  disc(pixels, SIZE, 8, 8, 7.4, style.border);
  disc(pixels, SIZE, 8, 8, 6.2, style.fill);
  for (const path of glyphPaths(style.glyph)) {
    stroke(pixels, SIZE, path, 1, WHITE);
  }
  return pixels;
}

function createIcon(state) {
  return nativeImage.createFromBuffer(encodePng(renderIcon(state), SIZE));
}

let tray = null;
let current = { state: 'idle', label: 'Idle' };
let resetTimer = null;
let onShow = () => {};

function showWindow() {
  onShow();
}

function buildMenu() {
  return Menu.buildFromTemplate([
    { label: current.label, enabled: false },
    { type: 'separator' },
    { label: 'Open Builder Tool', click: showWindow },
    { label: 'Quit', click: () => app.quit() }
  ]);
}

function refresh() {
  if (!tray || tray.isDestroyed()) return;
  const tooltip = current.state === 'idle' ? 'Builder Tool' : `Builder Tool — ${current.label}`;
  tray.setToolTip(tooltip);
  tray.setContextMenu(buildMenu());
  tray.setImage(createIcon(current.state));
}

function setStatus(state, label) {
  if (resetTimer) {
    clearTimeout(resetTimer);
    resetTimer = null;
  }
  current = { state, label };
  refresh();
}

function windowInBackground() {
  return !BrowserWindow.getAllWindows().some((win) => !win.isDestroyed() && win.isFocused());
}

// Keep the tray dot briefly on the outcome, then fall back to idle.
function settleAfter(state, label, ms) {
  setStatus(state, label);
  resetTimer = setTimeout(() => setStatus('idle', 'Idle'), ms);
}

function notify(title, body) {
  if (typeof Notification !== 'function') return;
  try {
    new Notification({ title, body }).show();
  } catch (err) {
    // Toasts can be refused (notifications disabled, focus assist). Never let
    // that break the run that triggered it.
    console.warn('[tray] notification failed:', err.message);
  }
}

function handleRunEvent(event) {
  if (!tray || tray.isDestroyed()) return;
  const notifyIfHidden = (title, body) => {
    if (windowInBackground()) notify(title, body);
  };

  if (event.type === 'started') {
    const label = `Running ${event.command} (${event.projectPath})`;
    setStatus('running', label);
    return;
  }
  if (event.type === 'exit') {
    if (event.code === 0) {
      settleAfter('success', 'Last run succeeded', 8000);
      notifyIfHidden('Builder Tool', 'Command finished successfully.');
    } else {
      settleAfter('failed', `Last run failed (exit code ${event.code})`, 15000);
      notifyIfHidden('Builder Tool', `Command failed with exit code ${event.code}.`);
    }
    return;
  }
  if (event.type === 'error') {
    settleAfter('failed', 'Last run failed', 15000);
    notifyIfHidden('Builder Tool', event.message);
  }
}

function initTray(options = {}) {
  onShow = options.onShow ?? (() => {});
  if (tray && !tray.isDestroyed()) return tray;
  tray = new Tray(createIcon('idle'));
  tray.setToolTip('Builder Tool');
  tray.setContextMenu(buildMenu());
  tray.on('click', showWindow);
  refresh();
  return tray;
}

function destroyTray() {
  if (resetTimer) clearTimeout(resetTimer);
  resetTimer = null;
  if (tray && !tray.isDestroyed()) tray.destroy();
  tray = null;
}

function trayState() {
  return { ...current, alive: Boolean(tray) && !tray.isDestroyed() };
}

module.exports = {
  STATES,
  SIZE,
  createIcon,
  renderIcon,
  encodePng,
  initTray,
  handleRunEvent,
  setStatus,
  destroyTray,
  trayState
};