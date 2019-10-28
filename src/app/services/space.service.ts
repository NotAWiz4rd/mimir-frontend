import {Injectable} from '@angular/core';
import {Folder} from '../classes/Folder';

@Injectable()
export class SpaceService {
  // this loads and stores all spaces
  currentSpace: string = '';
  currentRoot: Folder;

  constructor() {
  }

  convertPathToFolder(path: string): Folder {
    if (path.length === 0) {
      return this.currentRoot;
    }

    let pathBits: string[] = path.split('/');

    return this.lookForNextPathBitWithin(this.currentRoot, pathBits);
  }

  private lookForNextPathBitWithin(base: Folder, pathBits: string[]): Folder {
    for (let i = 0; i < base.folders.length; i++) {
      if (base.folders[i].name.toLowerCase() === pathBits[0].toLowerCase()) {
        // return folder if this is the last element of the pathBits
        if (pathBits.length === 1) {
          return base.folders[i];
        }

        return this.lookForNextPathBitWithin(this.currentRoot.folders[i], pathBits.slice(1));
      }
    }
    // we shall never arrive here. If we do, something went horribly wrong!
    console.log('Something went horribly wrong, trying to convert the following pathBits to a folder: ' + pathBits);
  }
}
