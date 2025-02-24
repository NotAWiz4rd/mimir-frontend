import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {RouterModule} from '@angular/router';
import {APP_ROUTES} from './app.routes';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {UserService} from './services/user.service';
import {NavigationService} from './services/navigation.service';
import {LanguageService} from './services/language.service';
import {GetStaticTextPipe} from './pipes/get-static-text.pipe';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ContentPageComponent} from './pages/content-page/content-page.component';
import {SpaceBarComponent} from './components/space-bar/space-bar.component';
import {HeaderBarComponent} from './components/header-bar/header-bar.component';
import {LoginComponent} from './pages/login/login.component';
import {ActionBarComponent} from './components/action-bar/action-bar.component';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatSidenavModule,
  MatSlideToggleModule,
  MatSnackBar,
  MatSnackBarContainer,
  MatSnackBarModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SearchComponent} from './components/search/search.component';
import {SearchService} from './services/search.service';
import {PathComponent} from './components/path/path.component';
import {SpaceService} from './services/space.service';
import {StaticTextService} from './services/static-text.service';
import {ThumbnailComponent} from './components/thumbnail/thumbnail.component';
import {FileViewComponent} from './components/file-view/file-view.component';
import {FileService} from './services/file.service';
import {SpaceBubbleComponent} from './components/space-bubble/space-bubble.component';
import {CreateFolderDialogComponent} from './components/create-folder-dialog/create-folder-dialog.component';
import {ActionMenuComponent} from './components/action-menu/action-menu.component';
import {FolderService} from './services/folder.service';
import {CreateSpaceDialogComponent} from './components/create-space-dialog/create-space-dialog.component';
import {UploadFileDialogComponent} from './components/upload-file-dialog/upload-file-dialog.component';
import {MatListModule} from '@angular/material/list';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {UploadService} from './services/upload.service';
import {ReuploadService} from './services/reupload.service';
import {DeletionDialogComponent} from './components/deletion-dialog/deletion-dialog.component';
import {RenameDialogComponent} from './components/rename-dialog/rename-dialog.component';
import {LandingPageComponent} from './pages/landing-page/landing-page.component';
import {ClipboardService} from './services/clipboard.service';
import {SpaceSettingsComponent} from './components/space-settings/space-settings.component';
import {TokenAuthInterceptor} from './helpers/token-auth.interceptor';
import {ThumbnailService} from './services/thumbnail.service';
import {CommentComponent} from './components/comment/comment.component';
import {NoAccessPageComponent} from './pages/no-access-page/no-access-page.component';
import {FileDataService} from './services/file-data.service';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';
import {FooterComponent} from './components/footer/footer.component';
import {RegisterPageComponent} from './pages/register-page/register-page.component';
import {ConfirmPageComponent} from './pages/confirm-page/confirm-page.component';
import {CopyUrlDialogComponent} from './components/copy-url-dialog/copy-url-dialog.component';
import {ErrorService} from "./services/error.service";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    GetStaticTextPipe,
    ContentPageComponent,
    SpaceBarComponent,
    HeaderBarComponent,
    ActionBarComponent,
    SearchComponent,
    PathComponent,
    ThumbnailComponent,
    FileViewComponent,
    SpaceBubbleComponent,
    SpaceBubbleComponent,
    CreateFolderDialogComponent,
    CreateSpaceDialogComponent,
    UploadFileDialogComponent,
    ActionMenuComponent,
    DeletionDialogComponent,
    RenameDialogComponent,
    CopyUrlDialogComponent,
    LandingPageComponent,
    SpaceSettingsComponent,
    CommentComponent,
    NoAccessPageComponent,
    FooterComponent,
    RegisterPageComponent,
    ConfirmPageComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(APP_ROUTES, {
      scrollPositionRestoration: 'disabled',
      onSameUrlNavigation: 'reload'
    }),
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSidenavModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
    FormsModule,
    MatListModule,
    MatProgressBarModule,
    MatMenuModule,
    MatSnackBarModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatIconModule,
    MatCardModule,
    MatToolbarModule,
    MatChipsModule,
    CKEditorModule,
  ],
  entryComponents: [
    CreateFolderDialogComponent,
    CreateSpaceDialogComponent,
    UploadFileDialogComponent,
    DeletionDialogComponent,
    RenameDialogComponent,
    CopyUrlDialogComponent,
    MatSnackBarContainer,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: TokenAuthInterceptor, multi: true},
    ThumbnailService,
    UserService,
    NavigationService,
    LanguageService,
    SearchService,
    SpaceService,
    FolderService,
    StaticTextService,
    FileService,
    FileDataService,
    UploadService,
    ClipboardService,
    MatSnackBar,
    ReuploadService,
    ErrorService,
    GetStaticTextPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
