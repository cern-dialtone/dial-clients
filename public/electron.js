const {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  Menu,
  Tray,
  dialog,
  Notification,
  systemPreferences
} = require('electron');
const fs = require('fs');
const pki = require('node-forge').pki;
const os = require('os');

const { autoUpdater } = require('electron-updater');
const path = require('path');
const isDev = require('electron-is-dev');
const storage = require('electron-json-storage');

const openAboutWindow = require('about-window').default;
const keytar = require('keytar');
const log = require('electron-log');
const { checkForUpdates } = require('./updater');

const logFormat = '{level} | {y}-{m}-{d} {h}:{i}:{s}:{ms} | {text}';
log.transports.rendererConsole.level = false;
log.transports.console.level = false;
log.transports.file.level = false;
if (!isDev) {
  log.transports.file.level = 'debug';
  log.transports.file.format = logFormat;
  log.transports.console.format = logFormat;
}

let mainWindow;
let authWindow;
let code;
let tray;
let forceQuit = false;
let goingToUpdate = false;

autoUpdater.on('update-downloaded', () => {
  goingToUpdate = true;
});

function isEmpty(ob) {
  for (const i in ob) {
    return false;
  }
  return true;
}

const appImagePath = isDev
  ? path.join(__dirname, '/../static/icon.png')
  : path.join(process.resourcesPath, 'icon.png');

const handleAuthClosedEvent = () => {
  // Dereference the authWindowdow object, usually you would store authWindowdows
  // in an array if your app supports multi authWindowdows, this is the time
  // when you should delete the corresponding element.
  authWindow = null;
};

const handleAuthDidNavigateEvent = (event, url) => {
  console.log(url);
  handleCallback(url);
};

function isAnyWindowOpen() {
  return (
    (mainWindow != null && mainWindow.isVisible()) ||
    (authWindow != null && authWindow.isVisible())
  );
}

const handleAuthDidFinishLoad = () => {
  console.log('Did finish load');
  if (mainWindow) {
    mainWindow.destroy();
  }
};

function createAuthWindow() {
  // Create the browser authWindowdow.
  authWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false
    },
    icon: appImagePath
  });

  const oauthUrl = `https://webrtc-auth.web.cern.ch`;

  authWindow.loadURL(oauthUrl);

  // Emitted when the authWindowdow is closed.
  authWindow.on('closed', handleAuthClosedEvent);
  authWindow.webContents.on('did-navigate', handleAuthDidNavigateEvent);
  authWindow.webContents.once('did-finish-load', handleAuthDidFinishLoad);
}

function logoutUser() {
  if (mainWindow) {
    console.log('Sendind logout request');
    mainWindow.webContents.send('logoutRequest');
  }
}

function unauthenticateUser() {
  storage.set('is_authenticated', {}, error => {
    keytar.deletePassword('cern-phone-app', 'access_token');
    keytar.deletePassword('cern-phone-app', 'refresh_token');
    keytar.deletePassword('cern-phone-app', 'tone_token');
    if (error) {
      console.log(`Error is_authenticated: ${error}`);
    }
    if (!authWindow) {
      createAuthWindow();
    }
    if (mainWindow) {
      mainWindow.destroy();
    }
  });
}

const openLogsFolder = () => {
  let logsPath;
  switch (process.platform) {
    case 'darwin':
      logsPath = path.join(
        app.getPath('home'),
        'Library',
        'Logs',
        'cern-phone-app',
        'log.log'
      );
      break;
    case 'win32':
      logsPath = path.join(
        app.getPath('home'),
        'AppData',
        'Roaming',
        'cern-phone-app',
        'log.log'
      );
      break;
    case 'linux':
      logsPath = path.join(
        app.getPath('home'),
        '.config',
        'cern-phone-app',
        'log.log'
      );
      break;
    default:
      break;
  }
  shell.showItemInFolder(logsPath);
};

const menu = Menu.buildFromTemplate([
  {
    label: 'App',
    submenu: [
      {
        label: 'About App',
        accelerator: 'CmdOrCtrl+A',
        click: () =>
          openAboutWindow({
            icon_path: appImagePath,
            product_name: 'CERN Phone App',
            package_json_dir: path.join(__dirname, '../'),
            use_version_info: true,
            license: 'GNU GENERAL PUBLIC (v3)',
            bug_link_text:
              'https://github.com/cern-dialtone/dial-clients/issues'
          })
      },
      {
        label: 'Check for updates...',
        accelerator: 'CmdOrCtrl+U',
        click: menuItem => {
          checkForUpdates(menuItem);
        }
      },
      {
        label: 'Open logs folder',
        accelerator: 'CmdOrCtrl+L',
        click: menuItem => {
          log.info('Clicked Open logs folder');
          openLogsFolder();
        }
      },
      {
        label: 'Logout',
        accelerator: 'CmdOrCtrl+O',
        click: () => {
          logoutUser();
        }
      },
      {
        label: 'Quit',
        accelerator: 'CmdOrCtrl+Q',
        click: () => {
          forceQuit = true;
          app.quit();
        }
      }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
      { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
      { type: 'separator' },
      { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
      { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
      { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
      {
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        selector: 'selectAll:'
      }
    ]
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forcereload' },
      { role: 'toggledevtools' },
      { type: 'separator' },
      { role: 'resetzoom' },
      { role: 'zoomin' },
      { role: 'zoomout' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  {
    role: 'window',
    submenu: [{ role: 'minimize' }, { role: 'close' }]
  }
]);

const sendAppHideNotification = () => {
  const notif = new Notification({
    title: 'CERN Phone App',
    body: 'The app has been minimized to tray.'
  });
  notif.show();
};

const showWindow = () => {
  if (mainWindow) {
    mainWindow.show();
  }

  if (authWindow && !mainWindow) {
    authWindow.hide();
  }
  createTray();
};

const askForMediaAccess = async () => {
  try {
    if (os.platform() !== 'darwin') {
      return true;
    }

    const status = await systemPreferences.getMediaAccessStatus('microphone');
    log.info('Current microphone access status:', status);

    if (status === 'not-determined') {
      const success = await systemPreferences.askForMediaAccess('microphone');
      return success.valueOf();
    }

    return status === 'granted';
  } catch (error) {
    log.error('Could not get microphone permission:', error.message);
  }
  return false;
};

const createWindow = async () => {
  console.log('Creating main window');
  mainWindow = new BrowserWindow({
    backgroundColor: '#F7F7F7',
    minWidth: 350,
    show: false,
    // titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true
    },
    height: 600,
    width: 1024,
    icon: appImagePath
  });

  const success = await askForMediaAccess('microphone');

  console.log(`The result of system preferences is: ${success}`);

  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );

  if (isDev) {
    const {
      default: installExtension,
      REACT_DEVELOPER_TOOLS,
      REDUX_DEVTOOLS
    } = require('electron-devtools-installer');

    installExtension(REACT_DEVELOPER_TOOLS)
      .then(name => {
        console.log(`Added Extension: ${name}`);
      })
      .catch(err => {
        console.log('An error occurred: ', err);
      });

    installExtension(REDUX_DEVTOOLS)
      .then(name => {
        console.log(`Added Extension: ${name}`);
      })
      .catch(err => {
        console.log('An error occurred: ', err);
      });
    require('devtron').install();
  }

  mainWindow.once('ready-to-show', () => {
    console.log('Showing main window');
    showWindow();

    if (isDev) {
      mainWindow.webContents.openDevTools();
    }

    ipcMain.on('open-external-window', (event, arg) => {
      shell.openExternal(arg);
    });
  });

  mainWindow.on('close', e => {
    if (forceQuit || goingToUpdate) {
      app.quit();
      return;
    }

    e.preventDefault();
    hide();
  });

  /**
   * Certificate verification
   */
  mainWindow.webContents.session.setCertificateVerifyProc(
    (request, callback) => {
      const { hostname, verificationResult, errorCode, certificate } = request;
      let certificateValid = false;
      // -202 Means it is self signed
      if (errorCode === -202) {
        console.log(
          `Request with hostname: ${hostname} verificationResult: ${verificationResult} errorCode: ${errorCode}`
        );
        // The ca certificate bundled in the application
        const certPath = isDev
          ? path.join(__dirname, '/../static/certificates/CERN_ca.crt')
          : path.join(process.resourcesPath, 'certificates', 'CERN_ca.crt');

        // Generating the certificates for validation
        const ca = pki.certificateFromPem(fs.readFileSync(certPath, 'ascii'));
        const client = pki.certificateFromPem(certificate.data);
        // We check if the certificate is valid
        try {
          console.log('Verifying certificate');

          if (!ca.verify(client)) {
            console.log('Unable to validate the certificate');
          } else {
            certificateValid = true;
          }
        } catch (err) {
          console.log(err);
          certificateValid = false;
          // For localhost developement we need this to accept https connection with self-signed certificates
          if (isDev) {
            process.stdout.write(`Preventing certificate error: ${hostname}\n`);
            certificateValid = true;
          }
        }
      }
      if (errorCode === 0 || certificateValid) {
        callback(0);
      } else {
        callback(-2);
      }
    }
  );
};

/**
 *
 * @param url
 */
function handleCallback(url) {
  const rawCode = /code=([^&]*)/.exec(url) || null;
  code = rawCode && rawCode.length > 1 ? rawCode[1] : null;
  const error = /\?error=(.+)$/.exec(url);

  // If there is a code, proceed to get token from github
  if (code) {
    createWindow();
    authWindow.destroy();
  } else if (error) {
    alert(
      "Oops! Something went wrong and we couldn't " +
        'log you in using Github. Please try again.'
    );
  }
}

// const handleAppCertificateError = (
//   event,
//   webContents,
//   url,
//   error,
//   certificate,
//   callback
// ) => {
//   if (isDev) {
//     process.stdout.write(`Preventing certificate error: ${url}\n`);
//     event.preventDefault();
//     callback(true);
//   }
// };

const hide = () => {
  if (mainWindow) {
    mainWindow.hide();
  }
  if (authWindow) {
    authWindow.hide();
  }
  sendAppHideNotification();

  createTray();

  if (app.dock != null) {
    app.dock.hide();
  }
};

const toggleDockIcon = () => {
  if (app.dock != null) {
    if (app.dock.isVisible()) {
      app.dock.hide();
    } else {
      app.dock.show();
    }
  }
};

const toggleWindow = () => {
  if (authWindow != null) {
    return authWindow.isVisible() ? authWindow.hide() : authWindow.show();
  }

  if (mainWindow != null) {
    return mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
  }
  return null;
};

const changeIcon = isLogged => {
  const icon = isLogged ? 'icon_16.png' : 'icon_logout_16.png';
  const imagePath = isDev
    ? path.join(__dirname, '/../static/icons/' + icon)
    : path.join(process.resourcesPath, 'icons', icon);

  tray.setImage(imagePath);
};

const createTray = () => {
  const imagePath = isDev
    ? path.join(__dirname, '/../static/icons/icon_logout_16.png')
    : path.join(process.resourcesPath, 'icons', 'icon_logout_16.png');

  if (tray == null) {
    tray = new Tray(imagePath);
    tray.on('click', () => {
      toggleWindow();
      toggleDockIcon();
      createTray();
    });
  }
  const tryMenu = Menu.buildFromTemplate([
    {
      label: isAnyWindowOpen() ? 'Hide' : 'Show',
      click: (item, window, event) => {
        if (isAnyWindowOpen()) {
          sendAppHideNotification();
        }

        toggleWindow();
        toggleDockIcon();
        createTray();
      }
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: (item, window, event) => {
        forceQuit = true;
        app.quit();
      }
    }
  ]);
  tray.setContextMenu(tryMenu);
};

const handleAppReady = () => {
  storage.get('is_authenticated', (error, data) => {
    if (error) throw error;

    if (isEmpty(data)) {
      console.log('empty dict');
    }

    Menu.setApplicationMenu(menu);

    if (!isEmpty(data) && data.authenticated === true) {
      code = data;
      createWindow();
    } else {
      createAuthWindow();
    }
    createTray();
  });
};

const appHandleAllWindowsClosed = () => {
  app.quit();
};
const appHandleActivate = () => {
  if (mainWindow === null) {
    createWindow();
  }
};

/**
 * App events
 */
// app.on('certificate-error', handleAppCertificateError);
app.on('ready', handleAppReady);
app.on('window-all-closed', appHandleAllWindowsClosed);
app.on('activate', appHandleActivate);

app.on('activate-with-no-open-windows', () => {
  showWindow();
});

const appHandleLoadPage = (event, arg) => {
  mainWindow.loadURL(arg);
};

const handleUserAsAuthenticated = async obj => {
  if (obj.access_token && obj.refresh_token) {
    await keytar.setPassword(
      'cern-phone-app',
      'access_token',
      obj.access_token
    );
    await keytar.setPassword(
      'cern-phone-app',
      'refresh_token',
      obj.refresh_token
    );
  }
  storage.set('is_authenticated', { authenticated: true }, error => {});
};

const updateAccessToken = async obj => {
  if (obj.access_token) {
    await keytar.setPassword(
      'cern-phone-app',
      'access_token',
      obj.access_token
    );
  }
};

const ipcHandleSyncMessages = async (event, arg, obj = null) => {
  if (arg === 'code') {
    event.returnValue = code;
    return;
  }

  if (arg === 'user-unauthenticated') {
    event.returnValue = 'ok';
    changeIcon(false);
    unauthenticateUser();
    return;
  }

  if (arg === 'update-access-token') {
    await updateAccessToken(obj);
    event.returnValue = 'ok';
    return;
  }

  if (arg === 'changeIcon') {
    changeIcon(obj.isLogged);
    event.returnValue = 'ok';
    return;
  }

  if (arg === 'user-authenticated') {
    await handleUserAsAuthenticated(obj);
    changeIcon(true);
    event.returnValue = 'ok';
  }

  if (arg === 'receiveCall') {
    event.returnValue = 'ok';
    if (obj && !obj.doNotDisturb) {
      showWindow();
    }
  }

  if (arg === 'getSecret' && obj && obj.name) {
    const secret = keytar.getPassword('cern-phone-app', obj.name);
    secret.then(result => {
      event.returnValue = result; // result will be 'secret'
    });
  }

  if (arg === 'saveToneToken' && obj && obj.name) {
    if (obj.tone_token) {
      keytar.setPassword('cern-phone-app', 'tone_token', obj.tone_token);
    }
    event.returnValue = 'ok';
  }

  if (arg === 'open-logs-folder') {
    openLogsFolder();
    event.returnValue = 'ok';
  }

  if (arg === 'setUpdateChannelValue') {
    console.log(`Setting update channel to ${obj.value}`);
    storage.set('update_channel', { channel: obj.value }, error => {
      if (error) {
        event.returnValue = 'error';
        console.error(`Unable to set updateChannel: ${error}`);
      } else {
        event.returnValue = 'ok';
      }
    });
  }
  if (arg === 'getUpdateChannelValue') {
    console.log('GetUpdateChannel');
    storage.get('update_channel', (error, data) => {
      if (error) event.returnValue = 'error';
      event.returnValue = data;
    });
  }
};

/**
 * Ipc events
 */
ipcMain.on('load-page', appHandleLoadPage);
ipcMain.on('synchronous-message', ipcHandleSyncMessages);
