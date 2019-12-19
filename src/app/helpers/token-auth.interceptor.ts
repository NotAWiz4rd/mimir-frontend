import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserService} from '../services/user.service';

@Injectable()
export class TokenAuthInterceptor implements HttpInterceptor {
  constructor(private userService: UserService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token = this.userService.token;
    const shareToken = this.userService.shareToken;
    if (shareToken && !request.url.includes('space')) { // include shareToken if it exists and we're not making some kind of space request
      token = shareToken;
    }

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + token,
        }
      });
    }

    return next.handle(request);
  }
}
