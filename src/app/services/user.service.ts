import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from '../classes/User';
import {SpaceMetadata} from '../classes/SpaceMetadata';

const TEST_URL = 'http://localhost:80/loginuser';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable()
export class UserService {
  currentUser$: BehaviorSubject<User> = new BehaviorSubject<User>(undefined);

  constructor(private http: HttpClient) {
    // todo remove this testdata
    let user = new User();
    let metaSpace = new SpaceMetadata();
    metaSpace.name = 'testSpace1';
    metaSpace.thumbnailId = 17;
    metaSpace.id = 1;

    let metaSpace2 = new SpaceMetadata();
    metaSpace2.name = 'testSpace2';
    metaSpace2.thumbnailId = 17;
    metaSpace2.id = 2;
    user.spaces = [metaSpace, metaSpace2, metaSpace, metaSpace2, metaSpace];
    this.currentUser$.next(user);
  }

  login(user: User): Observable<boolean> {
    // todo implement me properly
    return this.http.post<boolean>(TEST_URL, user, httpOptions);
  }
}
