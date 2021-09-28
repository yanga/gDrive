import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs/operators';
import {ResponseData} from '../models/response-data.model';
import {AppImage, DriveImage, FolderData} from '../models/image.model';
import {MimeType} from '../models/mime-type.enum';
import {DataFilters} from '../models/filters.model';
import {ConfigService} from './config.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  isRegistered = new BehaviorSubject(false);
  totalImages = new BehaviorSubject(0);
  likedImages = new BehaviorSubject(0);
  appImagesList = new BehaviorSubject<AppImage[]>([]);
  filteredImagesList = new BehaviorSubject<AppImage[]>([]);
  folderName = new BehaviorSubject('');
  folderList = new BehaviorSubject<FolderData[]>([]);
  ratingOperator = '=';
  clientShareId: string = '';
  ratingOperatorMap: { [key: string]: string } = {
    '=': '===',
    '>': '>=',
    '<': '<=',
    '===': '===',
  };

  initialFilters: DataFilters = {
    like: {
      active: false,
      value: false,
    },
    rating: {
      active: false,
      value: 0,
    },
    hasComment: {
      active: false,
      value: false,
    }
  };

  filters = new BehaviorSubject<DataFilters>({...this.initialFilters});

  constructor(private http: HttpClient, private config: ConfigService) {
    this.isRegistered.next(!!localStorage.getItem('email'));
  }

  loadFileList(clientShareId: string): Observable<ResponseData> {
    this.clientShareId = clientShareId;
    const localStorageData = this.getDataFromLocalStorage();
    this.folderList.next(this.getAllRegisteredFolders());

    if (localStorageData) {
      const {files, folder} = localStorageData;
      this.likedImages.next(files.filter(img => img.like).length);
      this.appImagesList.next(files);
      this.totalImages.next(files.length);
      this.filteredImagesList.next(files);
      this.folderName.next(folder);

      return of({
        config: null,
        data: {
          files: [],
        },
      });
    } else {
      return this.http.get<ResponseData>(`${this.config.getServer()}/getFiles/${clientShareId}`).pipe(
        tap(res => {
          const files = res.data.files;
          this.folderName.next(res.config.folder.name);
          this.createAppFilesList(files);
        }),
      );
    }
  }

  setRegistration(email: string): void {
    localStorage.setItem('email', email);
    this.isRegistered.next(true);
  }

  createAppFilesList(files: DriveImage[]) {
    let appImagesList: AppImage[] = [];
    files.forEach(file => {
      if (file.mimeType === MimeType.ImageJpeg) {
        appImagesList.push({
          id: file.id,
          thumbnailLink: file.thumbnailLink,
          webContentLink: file.webContentLink,
          name: file.name,
          rating: 0,
          like: false,
          comment: null,
          width: file.imageMediaMetadata.width,
          height: file.imageMediaMetadata.height,
        });
      }
    });

    this.totalImages.next(appImagesList.length);
    this.appImagesList.next(appImagesList);
    this.filteredImagesList.next(appImagesList);
    this.saveData();
  }

  setLike(fileId: string, like: boolean): void {
    const updatedList = this.appImagesList.getValue();
    const itemToUpdate = updatedList.find(item => item.id === fileId);

    if (itemToUpdate) {
      itemToUpdate.like = like;
      this.appImagesList.next(updatedList);
      this.likedImages.next(updatedList.filter(img => img.like).length);
      this.filterImages();
      this.saveData();
    }
  }

  setRating(fileId: string, rating: number): void {
    const updatedList = this.appImagesList.getValue();
    const itemToUpdate = updatedList.find(item => item.id === fileId);

    if (itemToUpdate) {
      itemToUpdate.rating = itemToUpdate.rating === rating ? 0 : rating;
      this.appImagesList.next(updatedList);
      this.filterImages();
      this.saveData();
    }
  }

  setComment(fileId: string, comment: string): void {
    const updatedList = this.appImagesList.getValue();
    const itemToUpdate = updatedList.find(item => item.id === fileId);

    if (itemToUpdate) {
      itemToUpdate.comment = comment;
      this.appImagesList.next(updatedList);
      this.filterImages();
      this.saveData();
    }
  }

  setLikeFilter(isLikeFilterOn: boolean): void {
    this.updateBehaviorSubject(this.filters, 'like', {active: isLikeFilterOn, value: isLikeFilterOn});
    this.filterImages();
  }

  setRatingFilter(rating: number): void {
    this.updateBehaviorSubject(this.filters, 'rating', {active: rating > 0, value: rating});
    this.filterImages();
  }

  setCommentFilter(comment: boolean): void {
    this.updateBehaviorSubject(this.filters, 'comment', {active: comment, value: comment});
    this.filterImages();
  }

  setRatingOperator(op: string): void {
    this.ratingOperator = op;

    this.filterImages();
  }

  private filterImages(): void {
    const query = this.getFilterQuery();
    if (query !== '') {
      const filtered = this.appImagesList.getValue().filter(img => eval(query));
      this.filteredImagesList.next(filtered);
    } else {
      this.filteredImagesList.next(this.appImagesList.getValue());
    }
  }

  getFilterQuery(): string {
    let conditions: string[] = [];
    const filters = this.filters.getValue();
    for (let key in filters) {
      if (filters[key].active) {
        switch (key) {
          case 'like':
            conditions.push(`img.${key} === ${filters[key].value}`);
            break;

          case 'comment':
            conditions.push(`img.${key}?.length`);
            break;

          case 'rating':
            let operator = this.ratingOperatorMap[this.ratingOperator];
            conditions.push(`img.${key} ${operator} ${filters[key].value} && img.${key} > 0`);
            break;
        }

      }
    }
    return conditions.join(' && ');
  }

  clearAllFilters(): void {
    this.filters.next({...this.initialFilters});
    this.filterImages();
  }

  selectAll(): void {
    const selection = this.filteredImagesList.getValue().map(img => img.id);
    const newList = this.appImagesList.getValue().map(img => {
      img.like = selection.includes(img.id);
      return img;
    });
    this.appImagesList.next(newList);
    this.likedImages.next(newList.length);
  }

  selectNone(): void {
    const newList = this.appImagesList.getValue().map(img => {
      img.like = false;
      return img;
    });
    this.likedImages.next(0);
    this.appImagesList.next(newList);
  }

  private updateBehaviorSubject(bs: BehaviorSubject<any>, key: string, val: any): void {
    const newBs = bs.getValue();
    newBs[key] = val;
    bs.next(newBs);
  }

  getSelectionList(): string[] {
    return this.appImagesList.getValue().filter(image => image.like).map(img => img.name);
  }

  saveData(): void {
    localStorage.setItem(this.clientShareId, JSON.stringify({
        files: this.appImagesList.getValue(),
        folder: this.folderName.getValue(),
      }
    ));
  }

  getDataFromLocalStorage(): { files: AppImage[], folder: string } {
    return JSON.parse(localStorage.getItem(this.clientShareId) || 'null');
  }

  getUserEmail(): string | null {
    return localStorage.getItem('email');
  }

  getAllRegisteredFolders(): FolderData[] {
    const localStorageData = localStorage;
    const folders = Object.keys(localStorage).filter(key => key !== 'email').map(key => {return {id: key, name: JSON.parse(localStorageData[key]).folder }});
    return folders;
  }
}

