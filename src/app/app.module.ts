import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {GalleryComponent} from './components/gallery/gallery.component';
import {HeaderComponent} from './components/header/header.component';
import {MatIconModule} from '@angular/material/icon';
import {PhotoActionBarComponent} from './components/photo-action-bar/photo-action-bar.component';
import {MatBadgeModule} from '@angular/material/badge';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {RegistrationComponent} from './components/registration/registration.component';
import {MatButtonModule} from '@angular/material/button';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FilterMenuComponent} from './components/filter-menu/filter-menu.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {CommentModalComponent} from './components/comment-modal/comment-modal.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import { LightboxModalComponent } from './components/lightbox-modal/lightbox-modal.component';
import { InfoModalComponent } from './components/info-modal/info-modal.component';
import {OverlayModule} from '@angular/cdk/overlay';
import {MatSliderModule} from '@angular/material/slider';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatMenuModule} from '@angular/material/menu';

@NgModule({
  declarations: [
    AppComponent,
    GalleryComponent,
    HeaderComponent,
    PhotoActionBarComponent,
    RegistrationComponent,
    FilterMenuComponent,
    CommentModalComponent,
    LightboxModalComponent,
    InfoModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatIconModule,
    MatBadgeModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    MatButtonToggleModule,
    MatDialogModule,
    FormsModule,
    MatDividerModule,
    OverlayModule,
    MatSliderModule,
    MatSnackBarModule,
    MatMenuModule,
  ],
  providers: [HttpClient],
  bootstrap: [AppComponent],
})
export class AppModule {
}
