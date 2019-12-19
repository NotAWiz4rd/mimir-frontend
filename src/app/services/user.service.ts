import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from '../classes/User';
import {SpaceMetadata} from '../classes/SpaceMetadata';
import {environment} from 'src/environments/environment';
import {SpaceService} from './space.service';

const LOCAL_STORAGE_TOKEN_KEY = 'cmspp-token';

@Injectable()
export class UserService {
  currentUser$: BehaviorSubject<User> = new BehaviorSubject<User>(undefined);
  token: string;

  constructor(private http: HttpClient,
              private spaceService: SpaceService) {
    this.token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
  }

  async login(username: string, password: string) {
    const params = new HttpParams()
      .set('username', username)
      .set('password', password);
    const response = await this.http.get<{ token: string }>(environment.apiUrl + 'login', {params}).toPromise();
    this.token = response.token;
    localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, this.token);
    await this.reloadUser();
  }

  async anonymousLogin(shareToken: string) {
    this.token = shareToken;
  }

  addSpaceToUser(space: SpaceMetadata) { // todo propagate this to the backend
    let spaces = this.currentUser$.value.spaces;
    spaces.push(space);
    let user = this.currentUser$.value;
    user.spaces = spaces;
    this.currentUser$.next(user);
  }

  async reloadUser() {
    let hubbleTelescope = this.http.get<SpaceMetadata[]>(environment.apiUrl + 'spaces'); // because it observes space(s)
    hubbleTelescope.subscribe(spaceMetadata => {
      let spaces: SpaceMetadata[] = spaceMetadata;
      let user = new User();  // todo replace with real user
      user.id = 42;
      user.spaces = spaces;
      this.currentUser$.next(user);
    });
    await hubbleTelescope.toPromise();
  }

  logout() {
    this.currentUser$.next(undefined);
    this.token = undefined;
    this.spaceService.currentSpace = undefined;
    this.spaceService.currentSpace$.next(undefined);
    this.spaceService.currentFolder = undefined;
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
  }

  register(username: string, mail: string, password: string) {
    // todo do this properly
    this.http.post(environment.apiUrl + 'register?receiver=' + mail + '&text=' + 'Registration successful!', {});
  }

  delete() {
    this.http.delete(environment.apiUrl + 'users/' + this.currentUser$.value.id);
    this.logout();
  }
}
