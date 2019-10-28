import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {SpaceService} from './space.service';

@Injectable()
export class NavigationService {
  constructor(private router: Router,
              private location: Location,
              private spaceService: SpaceService) {
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
    console.log('Navigating to ' + this.spaceService.currentSpace + '/' + pathWithinSpace);
    this.router.navigateByUrl(this.spaceService.currentSpace + '/' + pathWithinSpace);
  }

  navigateUp(currentPath: string) {
    let pathParts = currentPath.split('/');
    let newPath = '';
    for (let i = 0; i < pathParts.length - 1; i++) {
      newPath += pathParts[i];
    }
    this.navigateWithinSpace(newPath);
  }
}
