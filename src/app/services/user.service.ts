import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from '../classes/User';
import {SpaceMetadata} from '../classes/SpaceMetadata';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {NavigationService} from './navigation.service';

const LOGIN_URL = 'https://se.pfuetsch.xyz/login/';
const USER_URL = 'https://se.pfuetsch.xyz/users/';
const REGISTER_URL = 'https://se.pfuetsch.xyz/register/';
const SPACE_URL = 'https://se.pfuetsch.xyz/spaces/';

const KEY = 'YOU, W3ary TRAVELLER, Sh4LL P4ss!'; // encrypted key is this: WU9VLCBXM2FyeSBUUkFWRUxMRVIsIFNoNExMIFA0c3Mh

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable()
export class UserService implements CanActivate {
  currentUser$: BehaviorSubject<User> = new BehaviorSubject<User>(undefined);

  constructor(private http: HttpClient,
              private navigationService: NavigationService) {
    this.reloadUser();
  }

  login(username: string, password: string) {
    // todo implement me properly
  }

  addSpaceToUser(space: SpaceMetadata) {
    let spaces = this.currentUser$.value.spaces;
    spaces.push(space);
    let user = this.currentUser$.value;
    user.spaces = spaces;
    this.currentUser$.next(user);
  }

  reloadUser() {
    this.http.get<SpaceMetadata[]>(SPACE_URL).subscribe(spaceMetadata => {
      let spaces: SpaceMetadata[] = spaceMetadata;
      let user = new User();
      user.id = 42;
      user.spaces = spaces;
      this.currentUser$.next(user);
    });
  }

  logout() {
    this.currentUser$.next(undefined);
  }

  register(username: string, mail: string, password: string) {
    this.http.post(REGISTER_URL + '?receiver=' + mail + '&text=' + 'Registration successful!', {});
  }

  delete() {
    this.http.delete(USER_URL + '/' + this.currentUser$.value.id);
    this.logout();
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let verdict = false;

    let user = this.currentUser$.value;
    // check whether we are allowed to navigate to space
    let spaceId = route.params['spaceId'];
    if (spaceId != undefined && user != undefined) {
      for (let space of user.spaces) {
        if (spaceId == space.id) {
          return true;
        }
      }
      verdict = false;
    }

    let folderId = route.params['folderId'];
    let fileId = route.params['fileId'];
    let key = route.queryParams['key'];
    if ((folderId != undefined || fileId != undefined) && key != undefined) {
      verdict = atob(key) == KEY;
    }

    if (verdict == false) {
      this.navigationService.navigateToView('');
    }
    return verdict;
  }

  getUsersByIds(users: number[]): Observable<User[]> {
    let userSubject: BehaviorSubject<User[]> = new BehaviorSubject<User[]>(undefined);
    this.http.get<User[]>(USER_URL + users).subscribe(users => {
      userSubject.next(users);
    });
    return userSubject;
  }
}
