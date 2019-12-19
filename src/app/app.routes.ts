import {DataLayoutPageComponent} from './pages/data-layout-page/data-layout-page.component';
import {LoginComponent} from './pages/login/login.component';
import {LandingPageComponent} from './pages/landing-page/landing-page.component';
import {UserService} from './services/user.service';
import { ContentPageComponent } from './pages/content-page/content-page.component';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';

export const APP_ROUTES = [
  {
    path: 'login',
    component: LoginComponent,
    pathMatch: 'full'
  },
  {
    path: 'settings',
    component: SettingsPageComponent,
    canActivate: [UserService]
  },
  {
    path: 'space',
    component: DataLayoutPageComponent,
    children: [
      {
        path: ':spaceId/folder/:folderId',
        component: ContentPageComponent,
        canActivate: [UserService]
      },
      {
        path: ':spaceId/settings',
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
    ]
  },
  {
    path: '',
    component: LandingPageComponent,
    pathMatch: 'full'
  },
];
