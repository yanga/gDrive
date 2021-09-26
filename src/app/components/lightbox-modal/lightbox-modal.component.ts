import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  Inject,
  OnInit,
  Output
} from '@angular/core';
import {AppImage} from '../../models/image.model';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DataService} from '../../service/data.service';

export interface LightboxDialogData {
  img: AppImage;
  total: number;
  index: number;
}
@Component({
  selector: 'app-lightbox-modal',
  templateUrl: './lightbox-modal.component.html',
  styleUrls: ['./lightbox-modal.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LightboxModalComponent implements OnInit{
  img: AppImage | null = null;
  total = 0;
  index = 0;

  @Output() changeImage = new EventEmitter<number>();

  constructor(
    private dataService: DataService,
    public dialogRef: MatDialogRef<LightboxModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LightboxDialogData) {}

  ngOnInit(): void {
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

  back(): void {
    this.changeImage.emit(-1);
  }

  next(): void {
    this.changeImage.emit(1);
  }

  updateData(img: AppImage, index: number, total: number) {
    this.img = img;
    this.index = index;
    this.total = total;
    console.log('UD:::', index, total);
  }


  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    console.log('>>', event.code, event.key);
    switch (event.code) {
      case 'ArrowRight':
        this.next();
        break;

      case 'ArrowLeft':
        this.back();
        break;

      case 'KeyL':
        this.setLike(this.img?.id || '', !this.img?.like);
        break;

      default:
        if(event.code.indexOf('Digit') === 0 || event.code.indexOf('Numpad') === 0) {
          this.setRating(this.img?.id || '', parseInt(event.key));
        }
        break;
    }
  }
}
