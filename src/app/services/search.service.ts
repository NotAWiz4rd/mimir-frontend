import {Injectable} from '@angular/core';
import {SpaceService} from './space.service';
import {Folder} from '../classes/Folder';

@Injectable()
export class SearchService {
  constructor(private spaceService: SpaceService) {
  }

  getSearchablesForPath(path: string): string[] {
    if (this.spaceService.currentSpace == undefined) {
      return [];
    }
    const folder: Folder = this.spaceService.convertPathToFolder(path);
    return this.getAllSearchables(folder);
  }

  search(searchValue: string) {
    // todo implement me
    console.log(searchValue);
  }

  getAllSearchables(base: Folder): string[] {
    let names: string[] = [];
    names.push(base.name);

    // get all filenames in base
    for (let i = 0; i < base.files.length; i++) {
      names.push(base.files[i].name);
    }

    // get all filenames in folders below base
    for (let i = 0; i < base.folders.length; i++) {
      names = names.concat(this.getAllSearchables(base.folders[i]));
    }

    return names;
  }
}
