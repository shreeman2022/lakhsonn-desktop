// LAKHSONN OS — desktop shell (Electron). Loads the live platform in a clean,
// branded native window for macOS and Windows. Auto-updates with every deploy.
const { app, BrowserWindow, shell, Menu } = require('electron');

const APP_URL = 'https://lakhsonn.movezle.com';
let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 680,
    backgroundColor: '#0A1122',
    title: 'LAKHSONN OS · Tenant Console',
    icon: process.platform === 'win32' ? undefined : undefined, // set at build time
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      spellcheck: true,
    },
  });

  win.loadURL(APP_URL);

  // Open external links (mailto:, other sites) in the real browser, not inside the app.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (!url.startsWith(APP_URL)) { shell.openExternal(url); return { action: 'deny' }; }
    return { action: 'allow' };
  });
  win.webContents.on('will-navigate', (e, url) => {
    if (!url.startsWith(APP_URL)) { e.preventDefault(); shell.openExternal(url); }
  });

  // If the site is unreachable, show a simple offline message with a retry.
  win.webContents.on('did-fail-load', (e, code, desc, validatedURL, isMainFrame) => {
    if (isMainFrame && code !== -3) {
      win.loadURL('data:text/html,' + encodeURIComponent(
        `<body style="background:#0A1122;color:#E7ECF5;font-family:system-ui;display:grid;place-items:center;height:100vh;margin:0;text-align:center">
         <div><h2>Can’t reach LAKHSONN OS</h2>
         <p style="color:#8892A6">Check your internet connection.</p>
         <button onclick="location.href='${APP_URL}'" style="margin-top:12px;padding:10px 18px;border-radius:9px;border:0;background:#7C8CF8;color:#fff;font-size:14px;cursor:pointer">Retry</button>
         </div></body>`));
    }
  });
}

// Minimal, native menu — reload, zoom, fullscreen, quit + copy/paste.
function buildMenu() {
  const isMac = process.platform === 'darwin';
  const template = [
    ...(isMac ? [{ role: 'appMenu' }] : []),
    { role: 'fileMenu' },
    { role: 'editMenu' },
    { label: 'View', submenu: [
      { role: 'reload' }, { role: 'forceReload' }, { type: 'separator' },
      { role: 'resetZoom' }, { role: 'zoomIn' }, { role: 'zoomOut' }, { type: 'separator' },
      { role: 'togglefullscreen' },
    ]},
    { role: 'windowMenu' },
    // Help — the same legal, trust and support surfaces as movezle.com (Launch Master: desktop app covered by the policies)
    { role: 'help', submenu: [
      { label: 'Help & FAQ', click: () => shell.openExternal('https://movezle.com/faq') },
      { label: 'Contact Support', click: () => shell.openExternal('https://movezle.com/contact') },
      { label: 'Service Status', click: () => shell.openExternal('https://movezle.com/status') },
      { type: 'separator' },
      { label: 'Privacy Policy', click: () => shell.openExternal('https://movezle.com/legal/privacy') },
      { label: 'Terms of Use & SaaS Agreement', click: () => shell.openExternal('https://movezle.com/legal/terms') },
      { label: 'AI & Automation Terms', click: () => shell.openExternal('https://movezle.com/legal/ai-automation') },
      { label: 'Accessibility Statement', click: () => shell.openExternal('https://movezle.com/legal/accessibility') },
      { label: 'Legal Center', click: () => shell.openExternal('https://movezle.com/legal') },
      { type: 'separator' },
      { label: 'Security & Trust Center', click: () => shell.openExternal('https://movezle.com/security') },
      { label: 'Report a Security Vulnerability', click: () => shell.openExternal('https://movezle.com/legal/responsible-disclosure') },
      { type: 'separator' },
      { label: 'About LAKHSONN OS', click: () => {
        const { dialog } = require('electron');
        dialog.showMessageBox({ type: 'info', title: 'About LAKHSONN OS',
          message: 'LAKHSONN OS · Tenant Console ' + app.getVersion(),
          detail: 'Movezle Technologies Pvt. Ltd.\nHoskote, Bengaluru 560049, Karnataka, India\nsupport@movezle.com · +91 9933121317\n\nThis application signs you in to lakhsonn.movezle.com and stores only your session on this device. No analytics or advertising trackers run in the app.\n\n© 2026 Movezle Technologies Pvt. Ltd. Energy Beyond Endless Movement.' });
      } },
    ]},
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

app.whenReady().then(() => { buildMenu(); createWindow(); });
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
