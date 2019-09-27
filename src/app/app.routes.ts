import {ClientComponent} from './components/client/client.component';

export const APP_ROUTES = [
  {
    path: 'clients',
    component: ClientComponent,
    pathMatch: 'full'
  }
];
