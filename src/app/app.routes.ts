import {ContentPageComponent} from './pages/content-page/content-page.component';
import {LoginComponent} from './pages/login/login.component';
import {LandingPageComponent} from './pages/landing-page/landing-page.component';

export const APP_ROUTES = [
  {
    path: 'login',
    component: LoginComponent,
    pathMatch: 'full'
  },
  {
    path: 'settings',
    component: ContentPageComponent,
  },
  {
    path: 'space/:spaceId/folder/:folderId',
    component: ContentPageComponent,
  },
  {
    path: 'space/:spaceId/settings',
    component: ContentPageComponent,
  },
  {
    path: 'folder/:folderId',
    component: ContentPageComponent,
  },
  {
    path: 'file/:fileId',
    component: ContentPageComponent,
  },
  {
    path: '',
    component: LandingPageComponent,
    pathMatch: 'full'
  },
];
