import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserService} from '../services/user.service';

@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {
  constructor(private userService: UserService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with basic auth credentials if available
    const username = this.userService.username;
    const password = this.userService.password;
    if (username !== undefined && password !== undefined) {
      const token = btoa(username + ':' + password);
      request = request.clone({
        setHeaders: {
          Authorization: 'Basic ' + token,
        }
      });
    }

    return next.handle(request);
  }
}
