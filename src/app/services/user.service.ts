import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
import {User} from '../classes/User';
import {SpaceMetadata} from '../classes/SpaceMetadata';

const TEST_URL = 'https://se.pfuetsch.xyz/login/';
const SPACE_TEST_URL = 'https://se.pfuetsch.xyz/spaces/';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable()
export class UserService {
  currentUser$: BehaviorSubject<User> = new BehaviorSubject<User>(undefined);

  constructor(private http: HttpClient) {
    this.http.get<SpaceMetadata[]>(SPACE_TEST_URL).subscribe(spaceMetadata => {
      let spaces: SpaceMetadata[] = spaceMetadata;
      let user = new User();
      user.id = 42;
      user.spaces = spaces;
      this.currentUser$.next(user);
    });
  }

  login(user: User) {
    // todo implement me properly
  }

  addSpaceToUser(space: SpaceMetadata) {
    let spaces = this.currentUser$.value.spaces;
    spaces.push(space);
    let user = this.currentUser$.value;
    user.spaces = spaces;
    this.currentUser$.next(user);
  }
}
