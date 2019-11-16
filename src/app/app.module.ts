import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {RouterModule} from '@angular/router';
import {APP_ROUTES} from './app.routes';
import {HttpClientModule} from '@angular/common/http';
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
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatSidenavModule,
  MatTooltipModule
} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SearchComponent} from './components/search/search.component';
import {SearchService} from './services/search.service';
import {PathComponent} from './components/path/path.component';
import {SettingsPageComponent} from './pages/settings-page/settings-page.component';
import {SpaceService} from './services/space.service';
import {StaticTextService} from './services/static-text.service';
import {ThumbnailComponent} from './components/thumbnail/thumbnail.component';
import {FileViewComponent} from './components/file-view/file-view.component';
import {FileService} from './services/file.service';
import {SpaceBubbleComponent} from './components/space-bubble/space-bubble.component';
import {CreateFolderDialogComponent} from './components/create-folder-dialog/create-folder-dialog.component';

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
    SettingsPageComponent,
    ThumbnailComponent,
    FileViewComponent,
    SpaceBubbleComponent,
    SpaceBubbleComponent,
    CreateFolderDialogComponent,
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
  ],
  entryComponents: [
    CreateFolderDialogComponent,
  ],
  providers: [
    UserService,
    NavigationService,
    LanguageService,
    SearchService,
    SpaceService,
    StaticTextService,
    FileService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
