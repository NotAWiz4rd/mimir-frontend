import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {SpaceService} from './space.service';
import {Folder} from '../classes/Folder';
import {BehaviorSubject} from 'rxjs';
import {File} from '../classes/File';

@Injectable()
export class NavigationService {
  namePath$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(private router: Router,
              private location: Location,
              private spaceService: SpaceService) {
  }

  navigateToView(view: string) {
    console.log('Changed view to ' + view);
    this.router.navigateByUrl(view);
  }

  navigateToSettings() {
    this.router.navigateByUrl('settings');
  }

  navigateBack() {
    this.location.back();
  }

  navigateWithinSpace(folder: Folder) {
    if (this.spaceService.currentSpace.id != undefined) {
      this.router.navigateByUrl('space/' + this.spaceService.currentSpace.id + '/folder/' + folder.id);
    } else {
      this.router.navigateByUrl('folder/' + folder.id);
    }
  }

  figureOutPaths(folder: Folder) {
    this.namePath$.next(this.spaceService.convertFolderToPaths(folder));
  }

  navigateToFile(file: File, folder: Folder) {
    let path = this.spaceService.convertFolderToPaths(folder) + '/' + file.name + '.' + file.type;
    this.namePath$.next(path);
    if (this.spaceService.currentSpace.id != undefined) {
      this.router.navigate(['space/' + this.spaceService.currentSpace.id + '/folder/' + file.parentId, {fileId: file.id}]);
    } else {
      this.router.navigate(['folder/' + file.parentId, {fileId: file.id}]);
    }
  }
}
