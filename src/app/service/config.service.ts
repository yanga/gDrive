import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private server = 'http://localhost:3000';
  constructor() { }

  getServer(): string {
    return this.server;
  }
}
