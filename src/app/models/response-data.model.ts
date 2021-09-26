import {DriveImage} from './image.model';

export interface ResponseData {
  config: any;
  data: {
    files: DriveImage[],
  };
}
