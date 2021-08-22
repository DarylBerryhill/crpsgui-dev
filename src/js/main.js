/* jslint esnext:true */

// auto update
// https://stackoverflow.com/questions/59922073/how-to-get-my-electron-auto-updater-to-work

// import modules
const { app, BrowserWindow, Menu,
        globalShortcut, ipcMain, dialog } = require('electron');
const { autoUpdater }    = require('electron-updater');
let logger = require("electron-log");
const path   = require('path');
const url    = require('url');

// import user modules
const appMenu    = require('../json/appMenu.js');
const appOptions = require('../json/appOptions.js');
const mainMenu   = Menu.buildFromTemplate(appMenu);
const title      = 'Error Title';
const content    = 'The text content to display in the error box';

let relaunch = false;
let log = "";
let mainWindow;      // global reference of the window object


// define functions
const createWindow = ()=>
{
    // Create the browser window with detail options
    // reference: https://www.electronjs.org/docs/api/browser-window
    mainWindow = new BrowserWindow(appOptions );

    Menu.setApplicationMenu(mainMenu);


    mainWindow.setThumbarButtons(
    [
        {
            tooltip: 'button1',
            icon: path.join(__dirname, '../assets/RPC-MaxUPS-App.ico'),
            click () { console.log('button1 clicked'); },
            flags: "['enabled']"
        },
        {
            tooltip: 'button2',
            icon: path.join(__dirname, '../assets/RPC-MaxUPS-App.ico'),
            click () { console.log('button2 clicked'); },
            flags: "['disabled']"
        },
        {
            tooltip: 'button3',
            icon: path.join(__dirname, '../assets/RPC-MaxUPS-App.ico'),
            click () { console.log('button3 clicked'); },
            flags: "['enabled']"
        },
        {
            tooltip: 'button4',
            icon: path.join(__dirname, '../assets/RPC-MaxUPS-App.ico'),
            click () { console.log('button4 clicked'); },
            flags: "['disabled']"
        }
    ]);
    mainWindow.setThumbnailToolTip("Select any button at bottom");
    mainWindow.setThumbnailClip({ x: 10, y: 20, width: 800, height: 600 });
    mainWindow.setAutoHideMenuBar(true);
    mainWindow.setMenuBarVisibility(false);
    mainWindow.setProgressBar(0, {mode: "normal"});

    //  mainWindow.webContents.openDevTools();

    // load the index.html of the app.
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, '../../index.html'),
        protocol: 'file:',
        slashes: true
    }));

        // this event emits before 'ready-to-show'
    mainWindow.once('did-finish-load', () => {  });

    // this event emits after 'did-finish-load'
    mainWindow.once('ready-to-show', () =>
    {
        mainWindow.show();

        logger.transports.file.level = "info";
        logger = log;
        autoUpdater.checkForUpdatesAndNotify();

        console.log(`main window created and checking for updates`);
    });

    // Emitted when the window is closed.
    mainWindow.on('closed', function() { mainWindow = null; });

    mainWindow.webContents.on('crashed', (err) =>
    {
        app.relaunch();
        app.quit();
    });

}; // end createWindow()


appOptions.webPreferences.preload = path.join(__dirname, 'preload.js');

// dialog.showErrorBox(title, content);

// This is required to be set to false beginning in Electron v9 otherwise
// the SerialPort module can not be loaded in Renderer processes like we are doing
// in this example. The linked Github issues says this will be deprecated starting in v10,
// however it appears to still be changed and working in v11.2.0
// Relevant discussion: https://github.com/electron/electron/issues/18397
app.allowRendererProcessReuse=false;

// customize windows taskbar jumplist
app.setUserTasks([
  {
    program: process.execPath,
    arguments: '--new-window',
    iconPath: process.execPath,
    iconIndex: 0,
    title: 'New task',
    description: 'Create a new window'
  }
]);


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);


// Quit when all windows are closed.
app.on('window-all-closed', function() { app.quit(); });

 app.on('activate', function()
{
    if (mainWindow === null)
    {
        createWindow();
    }
 });




// ================================================================================
// auto update event listerners
// ================================================================================
autoUpdater.on('update-available', () =>
{
  mainWindow.webContents.send('update_available');
});

autoUpdater.on('update-downloaded', () =>
{
  mainWindow.webContents.send('update_downloaded');
});

autoUpdater.on('checking-for-update', () =>
{
  mainWindow.webContents.send('checking-for-update');
});

autoUpdater.on('update-not-available', (event, arg) =>
{
  mainWindow.webContents.send('update-not-available');
});

autoUpdater.on('download-progress', (event, progress) =>
{
    let log_message = "Download speed: " + progress.bytesPerSecond;

    log_message += ' - Downloaded ' + progress.percent + '%';
    log_message += ' (' + progress.transferred + "/" + progress.total + ')';

    sendStatusToWindow(log_message);

    mainWindow.webContents.send('download-progress', log_message);
});


// ================================================================================
// IPC event listeners
// ================================================================================
ipcMain.on('restart-app', (event, arg) =>
{
    app.relaunch();
    app.exit();
});

ipcMain.on('app_version', (event, arg) =>
{
  event.sender.send('app_version', { version: app.getVersion() });
});

ipcMain.on('restart_and_update', () =>
{
  autoUpdater.quitAndInstall();
});

ipcMain.on('update_check', () =>
{
   autoUpdater.checkForUpdatesAndNotify();
});

