import {Injectable} from "@angular/core";
import {MatSnackBar} from "@angular/material/snack-bar";
import {HttpErrorResponse} from "@angular/common/http";
import {throwError} from "rxjs";
import {Router} from "@angular/router";


@Injectable()
export class ErrorService {
  errorText: string;
  showText: boolean;

  constructor(public snackBar: MatSnackBar,
              private router: Router) {
  }

  handleError(error: HttpErrorResponse, context: string = '') {
    this.showText = true;
    if (error instanceof HttpErrorResponse) {
      this.errorText = 'ERROR ' + error.status;
      switch (error.status) {
        case 0:
          if (!navigator.onLine) {
            this.errorText = this.errorText + ': You are offline'
          } else if (context === 'upload') {
            this.errorText = this.errorText + ': File is probably too big'
          }
          break;
        case 401:
          this.errorText = this.errorText + ': Unauthorized. Please login';
          break;
        case 403:
          this.errorText = this.errorText + ': Forbidden';
          if (window.location.pathname === '/login') {
            this.errorText = this.errorText + '. Username or password was wrong.';
          } else {
            this.router.navigateByUrl('no-access');
            this.showText = false;
          }
          break;
        case 404:
          this.errorText = this.errorText + ': Page Not Found';
          break;
        case 413:
          this.errorText = this.errorText + ': Request Entity To Large';
          break;
        case 500:
          this.errorText = this.errorText + ': Internal Server Error';
          break;
        case 503:
          this.errorText = this.errorText + ': Service Unavailable';
      }
    } else {
      this.errorText = 'Some error occurred.';
    }
    if (this.showText) {
      this.showMessage(this.errorText);
    }
    return throwError(error);
  }

  private showMessage(message: string) {
    this.snackBar.open(message, null, {
      duration: 6000,
      panelClass: ['error-box']
    });
  }
}
