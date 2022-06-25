const { app, BrowserWindow, ipcMain, MessageChannelMain } = require("electron");
const isDev = require("electron-is-dev");
const path = require("path");

// Conditionally include the dev tools installer to load React Dev Tools
let installExtension, REACT_DEVELOPER_TOOLS;

if (isDev) {
  const devTools = require("electron-devtools-installer");
  installExtension = devTools.default;
  REACT_DEVELOPER_TOOLS = devTools.REACT_DEVELOPER_TOOLS;
}

async function createWindow() {
  const worker = new BrowserWindow({
    show: false,
    // maximizable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  await worker.loadURL(
    isDev
      ? "http://localhost:3000/worker.html"
      : `file://${path.join(__dirname, "../build/worker.html")}`
  );
  
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    maximizable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      // preload: path.join(__dirname, "preload.js"),
    },
  });

  // Load from localhost if in development
  // Otherwise load index.html file
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  // Open DevTools if in dev mode
  if (isDev) {
    mainWindow.maximize();
    mainWindow.webContents.openDevTools();
  }

  ipcMain.on('request-worker-channel', (event) => {
    // For security reasons, let's make sure only the frames we expect can
    // access the worker.
    if (event.senderFrame === mainWindow.webContents.mainFrame) {
      // Create a new channel ...
      const { port1, port2 } = new MessageChannelMain()
      console.log("setup");

      // ... send one end to the worker ...
      worker.webContents.postMessage('new-client', null, [port1])

      // ... and the other end to the main window.
      mainWindow.webContents.postMessage('provide-worker-channel', null, [port2])

      // Now the main window and the worker can communicate with each other
      // without going through the main process!
      console.log("Close");
    }
  })

}

// Create a new browser window by invoking the createWindow
// function once the Electron application is initialized.
// Install REACT_DEVELOPER_TOOLS as well if isDev
app.whenReady().then(() => {
  if (isDev) {
    installExtension(REACT_DEVELOPER_TOOLS)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((error) => console.log(`An error occurred: , ${error}`));
  }

  createWindow();
});

// Add a new listener that tries to quit the application when
// it no longer has any open windows. This listener is a no-op
// on macOS due to the operating system's window management behavior.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Add a new listener that creates a new browser window only if
// when the application has no visible windows after being activated.
// For example, after launching the application for the first time,
// or re-launching the already running application.
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// The code above has been adapted from a starter example in the Electron docs:
// https://www.electronjs.org/docs/tutorial/quick-start#create-the-main-script-file
