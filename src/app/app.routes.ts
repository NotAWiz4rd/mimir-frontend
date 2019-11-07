import {ContentPageComponent} from './pages/content-page/content-page.component';
import {LoginComponent} from './pages/login/login.component';
import {SettingsPageComponent} from './pages/settings-page/settings-page.component';

export const APP_ROUTES = [
  {
    path: 'login',
    component: LoginComponent,
    pathMatch: 'full'
  },
  {
    path: 'settings',
    component: SettingsPageComponent,
  },
  {
    path: 'space/:spaceId/folder/:folderId',
    component: ContentPageComponent,
  },
  {
    path: '',
    component: LoginComponent,
    pathMatch: 'full'
  },
];
