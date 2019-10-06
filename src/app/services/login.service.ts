import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from '../classes/User';

const TEST_URL = 'http://localhost:80/loginuser';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable()
export class LoginService {
  constructor(private http: HttpClient) {
  }

  login(user: User): Observable<boolean> {
    return this.http.post<boolean>(TEST_URL, user, httpOptions);
  }
}
