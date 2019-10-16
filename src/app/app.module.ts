import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {RouterModule} from '@angular/router';
import {APP_ROUTES} from './app.routes';
import {HttpClientModule} from '@angular/common/http';
import {LoginService} from './services/login.service';
import {NavigationService} from './services/navigation.service';
import {LoginComponent} from './components/login/login.component';
import {LanguageService} from './services/language.service';
import {GetStaticTextPipe} from './pipes/get-static-text.pipe';
import {Globals} from './util/Globals';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    GetStaticTextPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(APP_ROUTES, {
      scrollPositionRestoration: 'disabled',
      onSameUrlNavigation: 'reload'
    }),
    BrowserAnimationsModule,
  ],
  providers: [
    LoginService,
    NavigationService,
    LanguageService,
    Globals
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
