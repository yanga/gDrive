import {Component, OnInit} from '@angular/core';
import {DataService} from '../../service/data.service';
import {Observable, of} from 'rxjs';
import {MailerService} from '../../service/mailer.service';
import {ToastService, ToastStates} from '../../service/toast.service';
import {FolderData} from '../../models/image.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  total: Observable<number> | undefined;
  filtered: Observable<number> | undefined;
  likes: Observable<number> | undefined;
  folderList: Observable<FolderData[]> | undefined;
  folderName: string = '';

  constructor(
    private dataService: DataService,
    private mailerService: MailerService,
    private toastService: ToastService,
  ) {
  }

  ngOnInit(): void {
    this.total = this.dataService.totalImages;
    this.dataService.filteredImagesList.subscribe(filteredImagesList => {
      this.filtered = of(filteredImagesList.length);
    });
    this.likes = this.dataService.likedImages;
    this.dataService.folderName.subscribe((folder) => {
      this.folderName = folder;
    });
    this.folderList = this.dataService.folderList;
  }

  sendSelection(): void {
    const list = this.dataService.getSelectionList().join(', ');
    const email = this.dataService.getUserEmail() || '';
    this.mailerService.sendSelection(list, email, this.folderName).subscribe(res => {
      this.toastService.openSnackBar('Thank you! \n Your selection has been sent.', 'X', ToastStates.Success);
    }, () => {
      this.toastService.openSnackBar('Error! \n Please try again', 'X', ToastStates.Error);
    });
  }

  onFolderChange(id: string): void {
    window.location.href = `/?id=${id}`;
  }
}
