import { Injectable } from '@angular/core';
import {AppImage} from '../models/image.model';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {HttpClient, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MailerService {

  constructor(private http: HttpClient) { }

  sendSelection(selection: string, sender: string, folder: string): Observable<any> {
    const body = new HttpParams()
      .set('selection', selection)
      .set('sender', sender)
      .set('folder', folder);

    return this.http.post<any>(`http://localhost:3002/sendMail`,  body).pipe(
      tap(res => {
        return [];
      }),
    );
  }
}
