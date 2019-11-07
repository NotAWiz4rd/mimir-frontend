import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {SpaceService} from './space.service';
import {Folder} from '../classes/Folder';
import {BehaviorSubject} from 'rxjs';

@Injectable()
export class NavigationService {
  constructor(private router: Router,
              private location: Location,
              private spaceService: SpaceService) {
    this.spaceService.currentSpace$.subscribe(space => {
      if (space != undefined && this.namePath$.value.length < 1) {
        this.namePath$.next(space.root.name);
      }
    });
  }

  idPath: string = '';
  namePath$: BehaviorSubject<string> = new BehaviorSubject<string>('');

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

  navigateWithinSpace(folder: Folder) {
    this.figureOutPaths(folder);
    this.router.navigateByUrl('space/' + this.spaceService.currentSpace.id + '/folder/' + folder.id);
  }

  figureOutPaths(folder: Folder) {
    let paths: { idPath: string, namePath: string } = this.spaceService.convertFolderToPaths(folder);
    this.idPath = paths.idPath;
    this.namePath$.next(paths.namePath);
  }
}
