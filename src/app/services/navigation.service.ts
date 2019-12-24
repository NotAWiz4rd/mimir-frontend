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

  navigateToSpace(id: number, inSettings: boolean = false) {
    if (this.spaceService.currentSpace != undefined && this.spaceService.currentSpace.id == id && !inSettings) {
      return;
    }

    let spaceLoadingSubscription = this.spaceService.loadSpace(id).subscribe(space => {
      if (space != undefined && space.id == id) {
        this.navigateWithinSpace(space.root.id);
        if (spaceLoadingSubscription != undefined) {
          spaceLoadingSubscription.unsubscribe();
        }
      }
    });
  }

  navigateWithinSpace(folderId: number) {
    if (this.spaceService.currentSpace.id != undefined) {
      this.router.navigateByUrl('space/' + this.spaceService.currentSpace.id + '/folder/' + folderId);
    } else {
      this.router.navigate(['folder/' + folderId], {queryParams: {token: this.folderService.userService.shareToken}});
    }
  }

  figureOutPaths(folder: Folder) {
    this.namePath$.next(this.folderService.convertFolderToPaths(folder));
  }

  navigateToFile(file: File, folder: Folder) {
    let path = this.folderService.convertFolderToPaths(folder) + '/' + file.name;
    this.namePath$.next(path);
    if (this.spaceService.currentSpace.id != undefined) {
      this.router.navigate(['space/' + this.spaceService.currentSpace.id + '/folder/' + file.parentId, {fileId: file.id}]);
    } else {
      this.router.navigate(['folder/' + file.parentId, {fileId: file.id}], {queryParams: {token: this.folderService.userService.shareToken}});
    }
  }

  navigateSearch(currentSearchFolder: Folder, searchValue: string) {
    if (this.spaceService.currentSpace.id != undefined) {
      this.router.navigate(['space/' + this.spaceService.currentSpace.id + '/folder/' + currentSearchFolder.id, {searchValue: searchValue}]);
    } else {
      this.router.navigate(['folder/', currentSearchFolder.id, {searchValue: searchValue}], {queryParams: {token: this.folderService.userService.shareToken}});
    }
  }

  navigateToSpaceSettings(id: number) {
    this.router.navigateByUrl('space/' + id + '/settings');
  }

  navigateBack() {
    this.location.back();
  }
}
