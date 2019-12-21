import {ContentPageComponent} from './pages/content-page/content-page.component';
import {LoginComponent} from './pages/login/login.component';
import {LandingPageComponent} from './pages/landing-page/landing-page.component';
import {UserService} from './services/user.service';
import {NoAccessPageComponent} from './pages/no-access-page/no-access-page.component';

export const APP_ROUTES = [
  {
    path: 'login',
    component: LoginComponent,
    pathMatch: 'full'
  },
  {
    path: 'settings',
    component: ContentPageComponent,
    canActivate: [UserService]
  },
  {
    path: 'space/:spaceId/folder/:folderId',
    component: ContentPageComponent,
    canActivate: [UserService]
  },
  {
    path: 'space/:spaceId/settings',
    component: ContentPageComponent,
    canActivate: [UserService]
  },
  {
    path: 'folder/:folderId',
    component: ContentPageComponent,
    canActivate: [UserService]
  },
  {
    path: 'file/:fileId',
    component: ContentPageComponent,
    canActivate: [UserService]
  },
  {
    path: 'no-access',
    component: NoAccessPageComponent
  },
  {
    path: '',
    component: LandingPageComponent,
    pathMatch: 'full'
  },
];
