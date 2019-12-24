import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from '../classes/User';
import {SpaceMetadata} from '../classes/SpaceMetadata';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {environment} from 'src/environments/environment';
import {SpaceService} from './space.service';

const LOCAL_STORAGE_TOKEN_KEY = 'cmspp-token';

@Injectable()
export class UserService implements CanActivate {
  currentUser$: BehaviorSubject<User> = new BehaviorSubject<User>(undefined);
  token: string;
  shareToken: string;

  constructor(private http: HttpClient,
              private router: Router,
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

  addSpaceToUser(space: SpaceMetadata) { // todo propagate this to the backend
    let spaces = this.currentUser$.value.spaces;
    spaces.push(space);
    let user = this.currentUser$.value;
    user.spaces = spaces;
    this.currentUser$.next(user);
  }

  async reloadUser() {
    let hubbleTelescope = this.http.get<SpaceMetadata[]>(environment.apiUrl + 'spaces'); // because it observes space(s)
    hubbleTelescope.subscribe(
      spaceMetadata => {
        let spaces: SpaceMetadata[] = spaceMetadata;
        let user = new User();  // todo replace with real user
        user.id = 1;
        user.username = 'thellmann';
        user.spaces = spaces;
        this.currentUser$.next(user);
      },
      error => this.handleError(error));
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

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    let verdict = false;

    // checks whether we're accessing a file or folder via a direct link
    let folderId = route.params['folderId'];
    let fileId = route.params['fileId'];
    this.shareToken = route.queryParams['token'];
    if ((folderId != undefined || fileId != undefined) && this.shareToken != undefined) {
      verdict = true;
    }

    if (this.token != undefined && this.currentUser$.value == undefined) {
      await this.reloadUser();
    }

    let user = this.currentUser$.value;
    // check whether we are allowed to navigate to space
    let spaceId = route.params['spaceId'];
    if (spaceId != undefined && user != undefined) {
      for (let space of user.spaces) {
        if (spaceId == space.id) {
          return true;
        }
      }
    }

    if (user != undefined && state.toString().includes('settings')) {
      return true;
    }

    if (verdict == false) {
      this.router.navigateByUrl('');
    }
    return verdict;
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status == 403) {
      this.router.navigateByUrl('no-access');
    } else {
      console.error(error);
    }
  }

  getUsersByIds(users: number[]): Observable<User[]> {
    let userSubject: BehaviorSubject<User[]> = new BehaviorSubject<User[]>(undefined);
    this.http.get<User[]>(environment.apiUrl + 'users/' + users).subscribe(users => {
      userSubject.next(users);
    });
    return userSubject;
  }
}
