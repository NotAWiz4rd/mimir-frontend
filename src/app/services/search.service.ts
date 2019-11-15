import {Injectable} from '@angular/core';
import {SpaceService} from './space.service';
import {Folder} from '../classes/Folder';
import {NavigationService} from './navigation.service';

@Injectable()
export class SearchService {
  constructor(private spaceService: SpaceService,
              private navigationService: NavigationService) {
  }

  currentSearchFolder: Folder;

  getSearchablesForPath(path: string): string[] {
    if (this.spaceService.currentSpace == undefined) {
      return [];
    }
    this.currentSearchFolder = this.spaceService.convertPathToFolder(path);
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
    names.push(base.name);

    // get all filenames in base
    for (let i = 0; i < base.artifacts.length; i++) {
      names.push(base.artifacts[i].name);
    }

    // get all filenames in folders below base
    for (let i = 0; i < base.folders.length; i++) {
      names = names.concat(this.getAllSearchables(base.folders[i]));
    }

    return names;
  }
}
