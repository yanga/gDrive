import {MimeType} from './mime-type.enum';

export interface DriveImage {
  id: string,
  name: string,
  mimeType: MimeType,
  webContentLink: string,
  thumbnailLink: string,
  imageMediaMetadata: {
    width: number,
    height: number,
  },
};


export interface AppImage {
  id: string,
  webContentLink: string,
  thumbnailLink: string,
  name: string,
  like: boolean,
  rating: number,
  comment: string | null,
  width: number,
  height: number,
};

export interface FolderData {id: string, name: string};
