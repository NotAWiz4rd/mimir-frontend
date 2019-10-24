import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {Globals} from '../util/Globals';

@Injectable()
export class NavigationService {
  constructor(private router: Router,
              private location: Location,
              private globals: Globals) {
  }

  navigateToView(view: string) {
    console.log('Changed view to ' + view);
    this.router.navigateByUrl(view);
  }

  navigateHome() {
    this.router.navigateByUrl('');
  }

  navigateToSettings() {
    this.router.navigateByUrl('settings');
  }

  navigateBack() {
    console.log('Navigating to previous page');
    this.location.back();
  }

  navigateWithinSpace(pathWithinSpace: string) {
    console.log('Navigating to ' + this.globals.currentSpace + '/' + pathWithinSpace);
    this.router.navigateByUrl(this.globals.currentSpace + '/' + pathWithinSpace);
  }
}
