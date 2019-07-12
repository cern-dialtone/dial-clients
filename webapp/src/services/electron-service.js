const electron = window.require('electron');
const { ipcRenderer } = electron;

const SYNC_MESSAGE = 'synchronous-message';

class ElectronService {
  /**
   * Get the Oauth code from Electron
   */
  static getOauthCode = () => {
    const code = ipcRenderer.sendSync(SYNC_MESSAGE, 'code');
    return code;
  };

  /**
   * Unauthenticates the user from Electron
   */
  static setUserAsUnauthenticated = () => {
    const result = ipcRenderer.sendSync(SYNC_MESSAGE, 'user-unauthenticated');
    return result;
  };

  /**
   * Sets the user as authenticated on Electron sending the access and refresh tokens
   */
  static setUserAsAuthenticated = async (accessToken, refreshToken) => {
    const result = await ipcRenderer.sendSync(
      SYNC_MESSAGE,
      'user-authenticated',
      {
        access_token: accessToken,
        refresh_token: refreshToken
      }
    );
    return result;
  };

  /**
   * Sets the the access token
   */
  static updateAccessToken = async accessToken => {
    const result = await ipcRenderer.sendSync(
      SYNC_MESSAGE,
      'update-access-token',
      {
        access_token: accessToken
      }
    );
    return result;
  };

  /**
   * Gets the toneToken from the backend
   */
  static getToneToken = () => {
    const toneToken = ipcRenderer.sendSync(SYNC_MESSAGE, 'getSecret', {
      name: 'tone_token'
    });
    return toneToken;
  };

  static saveToneToken = toneToken => {
    const result = ipcRenderer.sendSync(SYNC_MESSAGE, 'saveToneToken', {
      name: 'saveToneToken',
      tone_token: toneToken
    });
    return result;
  };

  static clearTokens = () => {
    const result = ipcRenderer.sendSync(SYNC_MESSAGE, 'clearTokens');
    return result;
  };

  static setReceivingCall = doNotDisturbStatus => {
    const result = ipcRenderer.sendSync(SYNC_MESSAGE, 'receiveCall', {
      doNotDisturb: doNotDisturbStatus
    });
    return result;
  };
}

export default ElectronService;
