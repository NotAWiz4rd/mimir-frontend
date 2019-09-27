import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Location} from '@angular/common';

@Injectable()
export class NavigationService {
  constructor(private router: Router,
              private location: Location) {
  }

  navigateToView(view: string) {
    console.log('Changed view to ' + view);
    this.router.navigateByUrl(view);
  }

  navigateBack() {
    console.log('Navigating to previous page');
    this.location.back();
  }
}
