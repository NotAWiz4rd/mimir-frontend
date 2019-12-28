import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {BehaviorSubject, throwError} from 'rxjs';
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

    // todo fix get request being done twice because of subscribe and promise (without breaking error detection in LoginComponent)
    const loginObservable = this.http.get<{ token: string }>(environment.apiUrl + 'login', {params});
    loginObservable.subscribe(response => {
      this.token = response.token;
      localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, this.token);
    }, error => throwError(error));
    await loginObservable.toPromise();

    if (this.token != undefined) {
      await this.reloadUser();
    }
  }

  addSpaceToUser(space: SpaceMetadata) {
    let spaces = this.currentUser$.value.spaces;
    spaces.push(space);
    let user = this.currentUser$.value;
    user.spaces = spaces;
    this.currentUser$.next(user);
  }

  async reloadUser() {
    let userObservable = this.http.get<User>(environment.apiUrl + 'user');
    userObservable.subscribe(
      user => {
        this.currentUser$.next(user);
      },
      error => this.handleError(error));
    await userObservable.toPromise();
  }

  logout() {
    this.currentUser$.next(undefined);
    this.token = undefined;
    this.spaceService.currentSpace = undefined;
    this.spaceService.currentSpace$.next(undefined);
    this.spaceService.currentFolder = undefined;
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
  }

  register(mail: string, password: string) {
    // todo implement me
  }

  delete() {
    this.http.delete(environment.apiUrl + 'users/' + this.currentUser$.value.id);
    this.logout();
  }

  /**
   * Returns the spaceId of a Space that the current user has access to but is not the current space.
   * Returns -1 if none is available.
   */
  getDifferentSpaceId(): number {
    const currentSpaceId = this.spaceService.currentSpace.id;
    for (let space of this.currentUser$.getValue().spaces) {
      if (space.id != currentSpaceId) {
        return space.id;
      }
    }
    return -1;
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
}
