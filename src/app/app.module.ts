import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {RouterModule} from '@angular/router';
import {APP_ROUTES} from './app.routes';
import {HttpClientModule} from '@angular/common/http';
import {ClientService} from './services/client.service';
import {NavigationService} from './services/navigation.service';
import {ClientComponent} from './components/client/client.component';

@NgModule({
  declarations: [
    AppComponent,
    ClientComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(APP_ROUTES, {
      scrollPositionRestoration: 'disabled',
      onSameUrlNavigation: 'reload'
    }),
  ],
  providers: [
    ClientService,
    NavigationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
