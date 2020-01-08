import {Injectable, Pipe} from "@angular/core";
import {MatSnackBar} from "@angular/material/snack-bar";
import {HttpErrorResponse} from "@angular/common/http";
import {throwError} from "rxjs";
import {Router} from "@angular/router";
import {StaticTextService} from "./static-text.service";
import {LanguageService} from "./language.service";
import {GetStaticTextPipe} from "../pipes/get-static-text.pipe";


@Injectable()
export class ErrorService {
  errorText: string;
  showText: boolean;
  staticText: string;

  constructor(public snackBar: MatSnackBar,
              private router: Router,
              public staticTextService: StaticTextService,
              public languageService: LanguageService,
              private staticTextPipe: GetStaticTextPipe) {
  }

  handleError(error: HttpErrorResponse, context: string = '') {
    this.showText = true;
    if (error instanceof HttpErrorResponse) {
      this.errorText = 'ERROR ' + error.status;
      switch (error.status) {
        case 0:
          if (!navigator.onLine) {
            this.staticText = 'offline';
          } else if (context === 'upload') {
            this.staticText = 'fileTooBig';
          }
          break;
        case 401:
          this.staticText = 'error401';
          break;
        case 403:
          if (window.location.pathname === '/login') {
            this.staticText = 'error403login';
          } else {
            this.router.navigateByUrl('no-access');
            this.showText = false;
          }
          break;
        case 404:
          this.staticText = 'error404';
          break;
        case 413:
          this.staticText = 'error413';
          break;
        case 500:
          this.staticText = 'error500';
          break;
        case 503:
          this.staticText = 'error503';
      }
    } else {
      this.staticText = 'defaultError';
    }
    if (this.showText) {
      this.errorText = this.errorText + this.staticTextPipe
        .transform(this.staticTextService.staticTexts, this.staticText, this.languageService.getLanguage());
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
