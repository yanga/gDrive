const {google} = require('googleapis');
const CLIENT_ID = '618945599371-17l8uof98ooa7cmhf7k9nrhcv42i8uuv.apps.googleusercontent.com';
const CLIENT_SECRET = 'oGtJQzNskCy6XR_nspuj8dOc';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04t_yB5T-uJTxCgYIARAAGAQSNwF-L9IrM1wkPZMBpN8TcYiqUuouYnEcIAP5guVBMuTRcZlCAjShw3IOnrbwMJ7pMXwVT2ZKop8';
const ROOT_FOLDER_ID = '1dlqCvaObYI316-W7vFwItFrFXhKq8fGk';
const oauth2client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);


oauth2client.setCredentials({refresh_token: REFRESH_TOKEN});

const drive = google.drive({
  version: 'v3',
  auth: oauth2client,
})

export const driveService = {
  getFilesByShareId(shareId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        return drive.files.list({
          q: `'${shareId}' in parents and trashed = false`,
          pageSize: 999,
          fields: "files(id, name, imageMediaMetadata, mimeType, thumbnailLink, webContentLink)",
        }, (err: any, res: any) => {
          if (err) {
            console.log('ERR Des', err);
            reject(err);
          } else {
            this.getFolderName(shareId).then((folder: any) => {
              res.config.folder = folder;
              resolve(res)
            });
          }
        });
      } catch (error: any) {
        console.log('ERROR', error);
      }
    });
  },

  getFolderName(shareId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        return drive.files.list({
          q: `'${ROOT_FOLDER_ID}' in parents and trashed = false and mimeType = 'application/vnd.google-apps.folder'`,
          pageSize: 999,
          fields: "files(id, name, webContentLink)",
        }, (err: any, res: any) => {
          if (err) {
            console.log('ERR Des', err);
            reject(err);
          } else {
            resolve(res.data.files.filter((file: any) => file.id === shareId)[0]);
          }
        });
      } catch (error: any) {
        console.log('ERROR', error);
      }
    });
  },
};
