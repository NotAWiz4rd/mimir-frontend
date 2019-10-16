import {LoginComponent} from './components/login/login.component';
import {ContentPageComponent} from './pages/content-page/content-page.component';

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
