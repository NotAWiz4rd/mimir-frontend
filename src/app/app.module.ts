import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {RouterModule} from '@angular/router';
import {APP_ROUTES} from './app.routes';
import {HttpClientModule} from '@angular/common/http';
import {LoginService} from './services/login.service';
import {NavigationService} from './services/navigation.service';
import {LanguageService} from './services/language.service';
import {GetStaticTextPipe} from './pipes/get-static-text.pipe';
import {Globals} from './util/Globals';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ContentPageComponent} from './pages/content-page/content-page.component';
import {SpaceBarComponent} from './components/space-bar/space-bar.component';
import {HeaderBarComponent} from './components/header-bar/header-bar.component';
import {LoginComponent} from './pages/login/login.component';
import {ActionBarComponent} from './components/action-bar/action-bar.component';
import {MatAutocompleteModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSidenavModule} from '@angular/material';
import {ReactiveFormsModule} from '@angular/forms';
import {SearchComponent} from './components/search/search.component';
import {SearchService} from './services/search.service';

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
  ],
  providers: [
    LoginService,
    NavigationService,
    LanguageService,
    SearchService,
    Globals
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
