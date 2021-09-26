import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

export enum ToastStates {
  Success = 'success',
  Error = 'error',
};

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private _snackBar: MatSnackBar) {}

  openSnackBar(message: string, action: string, state?: ToastStates) {
    this._snackBar.open(message, action, {
      panelClass: `toast-dialog-${state || ToastStates.Success}`
    });
  }
}
