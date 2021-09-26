import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {CommentModalComponent} from '../comment-modal/comment-modal.component';
import {InfoModalComponent} from '../info-modal/info-modal.component';

@Component({
  selector: 'app-photo-action-bar',
  templateUrl: './photo-action-bar.component.html',
  styleUrls: ['./photo-action-bar.component.scss']
})
export class PhotoActionBarComponent implements OnInit {
  @Input() rating = 0;
  @Input() like = false;
  @Input() comment: string | null = null;
  @Input() showInfo = false;

  @Output() onLike = new EventEmitter<boolean>();
  @Output() onRating = new EventEmitter<number>();
  @Output() onComment = new EventEmitter<string>();

  rates = Array(5).fill(0);
  isOpen = false;

  constructor(public dialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  toggleLike(): void {
    this.onLike.emit(!this.like)
  }

  setRating(rating: number): void {
    this.onRating.emit(rating + 1);
  }

  openCommentDialog(): void {
    const dialogRef = this.dialog.open(CommentModalComponent, {
      width: '650px',
      height: '350px',
      data: {comment: this.comment}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.onComment.emit(result);
    });
  }

  openInfoDialog(): void {
    const dialogRef = this.dialog.open(InfoModalComponent, {
      width: '650px',
      height: '350px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.onComment.emit(result);
    });
  }
}
