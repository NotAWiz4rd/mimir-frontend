import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
import {User} from '../classes/User';
import {SpaceMetadata} from '../classes/SpaceMetadata';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {NavigationService} from './navigation.service';
import { environment } from 'src/environments/environment';

const KEY = 'YOU, W3ary TRAVELLER, Sh4LL P4ss!'; // encrypted key is this: WU9VLCBXM2FyeSBUUkFWRUxMRVIsIFNoNExMIFA0c3Mh

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable()
export class UserService implements CanActivate {
  currentUser$: BehaviorSubject<User> = new BehaviorSubject<User>(undefined);
  username: string;
  password: string;

  constructor(private http: HttpClient,
              private navigationService: NavigationService) {
  }

  login(username: string, password: string) {
    this.username = username;
    this.password = password;
    this.reloadUser();
  }

  addSpaceToUser(space: SpaceMetadata) {
    let spaces = this.currentUser$.value.spaces;
    spaces.push(space);
    let user = this.currentUser$.value;
    user.spaces = spaces;
    this.currentUser$.next(user);
  }

  reloadUser() {
    this.http.get<SpaceMetadata[]>(environment.apiUrl + 'spaces').subscribe(spaceMetadata => {
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
    this.http.post(environment.apiUrl + 'register?receiver=' + mail + '&text=' + 'Registration successful!', {});
  }

  delete() {
    this.http.delete(environment.apiUrl + 'users/' + this.currentUser$.value.id);
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
}
