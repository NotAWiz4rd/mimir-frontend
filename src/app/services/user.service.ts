import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
import {User} from '../classes/User';
import {SpaceMetadata} from '../classes/SpaceMetadata';

const LOGIN_URL = 'https://se.pfuetsch.xyz/login/';
const REGISTER_URL = 'https://se.pfuetsch.xyz/register/';
const SPACE_URL = 'https://se.pfuetsch.xyz/spaces/';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable()
export class UserService {
  currentUser$: BehaviorSubject<User> = new BehaviorSubject<User>(undefined);

  constructor(private http: HttpClient) {
    this.http.get<SpaceMetadata[]>(SPACE_URL).subscribe(spaceMetadata => {
      let spaces: SpaceMetadata[] = spaceMetadata;
      let user = new User();
      user.id = 42;
      user.spaces = spaces;
      this.currentUser$.next(user);
    });
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

  logout() {
    this.currentUser$.next(undefined);
  }

  register(username: string, mail: string, password: string) {
    this.http.post(REGISTER_URL + '?receiver=' + mail + '&text=' + 'Registration successful!', {});
  }
}
