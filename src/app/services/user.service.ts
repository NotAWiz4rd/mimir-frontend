import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
import {User} from '../classes/User';
import {SpaceMetadata} from '../classes/SpaceMetadata';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {environment} from 'src/environments/environment';
import {SpaceService} from './space.service';
import {tap} from 'rxjs/operators';
import {ErrorService} from './error.service';

const LOCAL_STORAGE_TOKEN_KEY = 'cmspp-token';

@Injectable()
export class UserService implements CanActivate {
  currentUser$: BehaviorSubject<User> = new BehaviorSubject<User>(undefined);
  token: string;
  shareToken: string;

  constructor(private http: HttpClient,
              private router: Router,
              private spaceService: SpaceService,
              private errorService: ErrorService) {
    this.token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
  }

  async login(username: string, password: string) {
    const formData = new FormData();
    formData.set('username', username);
    formData.set('password', password);

    await this.http.post<{ token: string }>(environment.apiUrl + 'login', formData)
      .pipe(
        tap(response => {
          this.token = response.token;
          localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, this.token);
        }))
      .toPromise().catch(error => this.errorService.handleError(error));

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
    await this.http.get<User>(environment.apiUrl + 'user')
      .pipe(
        tap(user => {
          this.currentUser$.next(user);
        }, error => this.errorService.handleError(error))
      ).toPromise();
  }

  logout() {
    this.currentUser$.next(undefined);
    this.token = undefined;
    this.spaceService.currentSpace = undefined;
    this.spaceService.currentSpace$.next(undefined);
    this.spaceService.currentFolder = undefined;
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
  }

  async register(mail: string) {
    await this.http.post(environment.apiUrl + 'register/mail?mail=' + mail, {}).toPromise();
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
      console.log(this.currentUser$.getValue());
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
      console.log(this.token);
      console.log(route.params);
      this.router.navigateByUrl('');
    }
    return verdict;
  }

  /**
   * Confirms registration by relaying password to backend.
   */
  async finishRegistration(password: string, token: string) {
    const formData = new FormData();
    formData.set('token', token);
    formData.set('password', password);
    await this.http.post(environment.apiUrl + 'register/confirm', formData).toPromise();
  }
}
