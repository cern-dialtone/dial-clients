const { dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const storage = require('electron-json-storage');

let updater;
autoUpdater.autoDownload = false;

// if (process.env.REACT_APP_NEXT) {
//   autoUpdater.channel = 'beta';
// } else {
//   autoUpdater.allowPrerelease = false;
// }

autoUpdater.on('error', error => {
  dialog.showErrorBox(
    'Error: ',
    error == null ? 'unknown' : (error.stack || error).toString()
  );
  updater.enabled = true;
  updater = null;
});

autoUpdater.on('update-available', () => {
  dialog.showMessageBox(
    {
      type: 'info',
      title: 'Found Updates',
      message: 'Found updates, do you want update now?',
      buttons: ['Sure', 'No']
    },
    buttonIndex => {
      if (buttonIndex === 0) {
        autoUpdater.downloadUpdate();
      } else {
        updater.enabled = true;
        updater = null;
      }
    }
  );
});

autoUpdater.on('update-not-available', () => {
  dialog.showMessageBox({
    title: 'No Updates',
    message: 'Current version is up-to-date.'
  });
  updater.enabled = true;
  updater = null;
});

autoUpdater.on('update-downloaded', () => {
  dialog.showMessageBox(
    {
      title: 'Install Updates',
      message: 'Updates downloaded, application will be quit for update...'
    },
    () => {
      setImmediate(() => autoUpdater.quitAndInstall());
    }
  );
});

// export this to MenuItem click callback
function checkForUpdates(menuItem, focusedWindow, event) {
  updater = menuItem;
  updater.enabled = false;

  storage.get('update_channel', (error, data) => {
    let channel = data.channel || 'latest';
    console.log(`Updating app using channel: ${channel}`);

    if (error) {
      console.log(`Error found checking updates: ${error}`);
      channel = 'latest';
    }
    autoUpdater.channel = channel;
    autoUpdater.checkForUpdates();
  });
}
module.exports.checkForUpdates = checkForUpdates;