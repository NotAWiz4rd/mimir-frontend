import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {UserService} from '../services/user.service';
import {catchError} from "rxjs/operators";
import {ErrorService} from "../services/error.service";

@Injectable()
export class TokenAuthInterceptor implements HttpInterceptor {
  constructor(private userService: UserService,
              private errorService: ErrorService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token = this.userService.token;
    const shareToken = this.userService.shareToken;
    if (shareToken && !request.url.includes('/user') && !request.url.includes('space')) { // include shareToken if it exists and we're not making some kind of user or space request
      token = shareToken;
    }

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + token,
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error) => this.errorService.handleError(error))
    );
  }
}
