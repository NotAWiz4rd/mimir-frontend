import {ContentPageComponent} from './pages/content-page/content-page.component';
import {LoginComponent} from './pages/login/login.component';

export const APP_ROUTES = [
  {
    path: 'login',
    component: LoginComponent,
    pathMatch: 'full'
  },
  {
    path: '',
    component: ContentPageComponent,
  },
];
