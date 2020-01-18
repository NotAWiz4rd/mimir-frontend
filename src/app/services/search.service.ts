import {Injectable} from '@angular/core';
import {SpaceService} from './space.service';
import {Folder} from '../classes/Folder';
import {NavigationService} from './navigation.service';
import {File} from '../classes/File';
import {FolderService} from './folder.service';

@Injectable()
export class SearchService {
  constructor(private spaceService: SpaceService,
              private folderService: FolderService,
              private navigationService: NavigationService) {
  }

  currentSearchFolder: Folder;

  getSearchablesForPath(path: string): string[] {
    if (this.spaceService.currentSpace == undefined) {
      return [];
    }
    this.currentSearchFolder = this.folderService.convertPathToFolder(path);
    if (this.currentSearchFolder == undefined) {
      return [];
    }
    return this.getAllSearchables(this.currentSearchFolder);
  }

  search(searchValue: string) {
    this.navigationService.navigateSearch(this.currentSearchFolder, searchValue);
  }

  getAllSearchables(base: Folder): string[] {
    let names: string[] = [];
    if (base == null || this.spaceService.currentFolder == null) {
      return [];
    }

    if (base.name != this.spaceService.currentFolder.name) {
      names.push(base.name);
    }

    // get all filenames in base
    if (base.artifacts != null) {
      for (let i = 0; i < base.artifacts.length; i++) {
        names.push(base.artifacts[i].name);
      }
    }

    // get all filenames in folders below base
    if (base.folders != null) {
      for (let i = 0; i < base.folders.length; i++) {
        names = names.concat(this.getAllSearchables(base.folders[i]));
      }
    }

    return names;
  }

  static collectMatchingFilesAndFolders(base: Folder, searchValue: string): [File[], Folder[]] {
    let files: File[] = [];
    let folders: Folder[] = [];

    for (let i = 0; i < base.artifacts.length; i++) {
      if (base.artifacts[i].name.toLowerCase().includes(searchValue.toLowerCase())) {
        files.push(base.artifacts[i]);
      }
    }

    for (let i = 0; i < base.folders.length; i++) {
      if (base.folders[i].name.toLowerCase().includes(searchValue.toLowerCase())) {
        folders.push(base.folders[i]);
      }
      let filesAndFolders: [File[], Folder[]] = this.collectMatchingFilesAndFolders(base.folders[i], searchValue);
      files = files.concat(filesAndFolders[0]);
      folders = folders.concat(filesAndFolders[1]);
    }

    return [files, folders];
  }
}
