import {Injectable} from '@angular/core';
import {Folder} from '../classes/Folder';
import {Space} from '../classes/Space';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';

const SPACE_TEST_PATH = '../../../assets/space-';
const FOLDER_TEST_PATH = '../../../assets/folder.json';

@Injectable()
export class SpaceService {
  currentSpace: Space;
  currentSpace$: BehaviorSubject<Space> = new BehaviorSubject<Space>(this.currentSpace);

  constructor(private http: HttpClient) {
  }

  loadSpace(spaceId: number): Observable<Space> {
    if (spaceId != undefined && (this.currentSpace == undefined || (this.currentSpace.id != spaceId))) {
      // todo make proper request
      this.http.get<Space>(SPACE_TEST_PATH + spaceId + '.json').subscribe(space => {
        this.currentSpace = space;
        console.log('loaded space: ' + spaceId);
        this.currentSpace$.next(this.currentSpace);
      });
    }
    return this.currentSpace$;
  }

  /**
   * Loads a folder from the backend and puts it into a temporary space so everything still works properly.
   * @param folderId
   */
  loadFolder(folderId: number): BehaviorSubject<Space> {
    if (this.currentSpace != undefined) {
      for (let i = 0; i < this.currentSpace.root.folders.length; i++) {
        if (this.currentSpace.root.folders[i].id === folderId) {
          return this.currentSpace$;
        }
      }
    }

    this.http.get<Folder>(FOLDER_TEST_PATH).subscribe(folder => {
      this.currentSpace = new Space();
      this.currentSpace.root = folder;
      this.currentSpace.root.parentId = 0;
      this.currentSpace.name = 'temp';
      this.currentSpace$.next(this.currentSpace);
      console.log('loaded folder: ' + folderId);
    });
    return this.currentSpace$;
  }

  getFolderFromSpace(id: number): Folder {
    return SpaceService.searchForFolder(this.currentSpace.root, id);
  }

  private static searchForFolder(base: Folder, id: number): Folder {
    if (base.id === id) {
      return base;
    }

    if (base.folders == undefined) {
      return null;
    }

    for (let folder of base.folders) {
      if (folder.id === id) {
        return folder;
      } else {
        let possibleFolder = this.searchForFolder(folder, id);
        if (possibleFolder != null) {
          return possibleFolder;
        }
      }
    }
    return null;
  }

  convertFolderToPaths(folder: Folder): string {
    let namePath = folder.name;
    let currentFolder = folder;
    while (currentFolder.parentId != 0) {
      currentFolder = this.getFolderFromSpace(currentFolder.parentId);
      namePath += '/' + currentFolder.name;
    }

    return SpaceService.reversePath(namePath);
  }

  private static reversePath(str: string): string {
    return str.split('/').reverse().join('/');
  }

  convertPathToFolder(path: string): Folder {
    if (path.length === 0 || path.endsWith(this.currentSpace.root.name)) {
      return this.currentSpace.root;
    } else {
      path = path.replace(this.currentSpace.root.name + '/', '');
    }

    let pathBits: string[] = path.split('/');

    return this.lookForNextPathBitWithin(this.currentSpace.root, pathBits);
  }

  private lookForNextPathBitWithin(base: Folder, pathBits: string[]): Folder {
    for (let i = 0; i < base.folders.length; i++) {
      if (base.folders[i].name.toLowerCase() === pathBits[0].toLowerCase()) {
        // return folder if this is the last element of the pathBits
        if (pathBits.length === 1) {
          return base.folders[i];
        }

        return this.lookForNextPathBitWithin(this.currentSpace.root.folders[i], pathBits.slice(1));
      }
    }
    for (let i = 0; i < base.files.length; i++) {
      if ((base.files[i].name + '.' + base.files[i].type).toLowerCase() === pathBits[0].toLowerCase()) {
        return base;
      }
    }

    // we shall never arrive here. If we do, something went horribly wrong!
    console.error('Something went horribly wrong, trying to convert the following pathBits to a folder: '
      + pathBits + ' in the following base folder: ' + base.id);
  }
}
