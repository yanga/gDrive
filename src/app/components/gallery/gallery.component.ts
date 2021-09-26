import {Component, OnInit} from '@angular/core';
import {AppImage} from '../../models/image.model';
import {ResponseData} from '../../models/response-data.model';
import {DataService} from '../../service/data.service';
import {FormControl, FormGroupDirective, NgForm} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {LightboxModalComponent} from '../lightbox-modal/lightbox-modal.component';
import {MatSliderChange} from '@angular/material/slider';
import {DeviceDetectorService} from 'ngx-device-detector';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})

export class GalleryComponent implements OnInit {
  shareId: string = '';
  driveImages: AppImage[] | null = null;
  lightBoxImages: {}[] = [];
  isRegistered: Observable<boolean> | undefined;
  loadingImages = false;
  lightBoxIndex = 0;
  preLoadImages = new Array();
  thumbDefaultSize = 5;
  thumbWidth = 120 + (23 * this.thumbDefaultSize);

  private dialogRef: MatDialogRef<LightboxModalComponent> | undefined;

  constructor(private dataService: DataService,
              public dialog: MatDialog,
              private deviceService: DeviceDetectorService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.thumbDefaultSize = this.deviceService.isMobile() ? 10 : 5;
    this.thumbWidth = 120 + (23 * this.thumbDefaultSize);
    this.shareId = this.router.parseUrl(this.router.url).queryParams.id;
    this.isRegistered = this.dataService.isRegistered.pipe();
    this.loadingImages = true;
    this.dataService.loadFileList(this.shareId).subscribe((response: ResponseData) => {
      this.loadingImages = false;
    });
    this.dataService.filteredImagesList.subscribe(files => {
      this.lightBoxImages = files.map(img => {
        return {
          src: img.webContentLink,
          thumb: img.thumbnailLink,
        }
      });
      return this.driveImages = files;
    });
  }

  openLightBox(img: AppImage): void {
    this.lightBoxIndex = this.driveImages?.findIndex(image => image.id === img.id) || 0;
    this.dialogRef = this.dialog.open(LightboxModalComponent, {
      width: '100%',
      height: '95vh',
      data: {total: 0, index: 0, img}
    });

    if (this.driveImages && this.dialogRef) {
      this.dialogRef.componentInstance.updateData(this.driveImages[this.lightBoxIndex], this.lightBoxIndex + 1, this.lightBoxImages.length);
      this.preloadImage(
        this.driveImages[Math.min(this.lightBoxIndex + 1, this.lightBoxImages.length - 1)].webContentLink,
        this.driveImages[Math.max(this.lightBoxIndex - 1, 0)].webContentLink,
      );
    }

    this.dialogRef.componentInstance.changeImage.subscribe((dir) => {
      this.lightBoxIndex = Math.min(this.lightBoxImages.length - 1, Math.max(0, this.lightBoxIndex + dir));
      if (this.driveImages && this.dialogRef) {
        this.dialogRef.componentInstance.updateData(this.driveImages[this.lightBoxIndex], this.lightBoxIndex + 1, this.lightBoxImages.length);

        this.preloadImage(
          this.driveImages[Math.min(this.lightBoxIndex + 1, this.lightBoxImages.length - 1)].webContentLink,
          this.driveImages[Math.max(this.lightBoxIndex - 1, 0)].webContentLink,
        );
      }
    })
  }

  preloadImage(...args: any[]): void {
    for (let i = 0; i < args.length; i++) {
      this.preLoadImages[i] = new Image();
      this.preLoadImages[i].src = args[i];
    }
  }

  setLike(id: string, like: boolean): void {
    this.dataService.setLike(id, like);
  }

  setRating(id: string, rating: number): void {
    this.dataService.setRating(id, rating);
  }

  setComment(id: string, comment: string): void {
    this.dataService.setComment(id, comment);
  }

  selectAll(): void {
    this.dataService.selectAll();
  }

  selectNone(): void {
    this.dataService.selectNone();
  }

  changeThumbnailSize(val: MatSliderChange): void {
    this.thumbWidth = ((val.value || 1) * 23) + 120;
  }
}
