import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {SpaceService} from './space.service';
import {Folder} from '../classes/Folder';
import {BehaviorSubject} from 'rxjs';
import {File} from '../classes/File';
import {FolderService} from './folder.service';

@Injectable()
export class NavigationService {
  namePath$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(private router: Router,
              private location: Location,
              private spaceService: SpaceService,
              private folderService: FolderService) {
  }

  navigateToView(view: string) {
    console.log('Changed view to ' + view);
    this.router.navigateByUrl(view);
  }

  navigateToSettings() {
    this.router.navigateByUrl('settings');
  }

  navigateUp(currentPath: string) {
    let folder = this.folderService.convertPathToFolder(currentPath);
    if (folder.parentId == null || currentPath.includes('.')) { // check if we're either in the topmost folder or in a file
      this.navigateWithinSpace(folder.id);
    } else {
      this.navigateWithinSpace(folder.parentId);
    }
  }

  navigateToSpace(id: number) {
    if (this.spaceService.currentSpace.id == id) {
      return;
    }

    let spaceLoadingSubscription = this.spaceService.loadSpace(id).subscribe(space => {
      if (space.id == id) {
        this.navigateWithinSpace(space.root.id);
        spaceLoadingSubscription.unsubscribe();
      }
    });
  }

  navigateWithinSpace(folderId: number) {
    if (this.spaceService.currentSpace.id != undefined) {
      this.router.navigateByUrl('space/' + this.spaceService.currentSpace.id + '/folder/' + folderId);
    } else {
      this.router.navigateByUrl('folder/' + folderId);
    }
  }

  figureOutPaths(folder: Folder) {
    this.namePath$.next(this.folderService.convertFolderToPaths(folder));
  }

  navigateToFile(file: File, folder: Folder) {
    let path = this.folderService.convertFolderToPaths(folder) + '/' + file.name + '.' + file.contentType.split('/')[1];
    this.namePath$.next(path);
    if (this.spaceService.currentSpace.id != undefined) {
      this.router.navigate(['space/' + this.spaceService.currentSpace.id + '/folder/' + file.parentId, {fileId: file.id}]);
    } else {
      this.router.navigate(['folder/' + file.parentId, {fileId: file.id}]);
    }
  }

  navigateSearch(currentSearchFolder: Folder, searchValue: string) {
    if (this.spaceService.currentSpace.id != undefined) {
      this.router.navigate(['space/' + this.spaceService.currentSpace.id + '/folder/' + currentSearchFolder.id, {searchValue: searchValue}]);
    } else {
      this.router.navigate(['folder/', currentSearchFolder.id, {searchValue: searchValue}]);
    }
  }
}
