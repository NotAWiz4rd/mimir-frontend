import {Injectable} from '@angular/core';
import {Folder} from '../classes/Folder';
import {Space} from '../classes/Space';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';

const SPACE_TEST_PATH = '../../../assets/space.json';
const FOLDER_TEST_PATH = '../../../assets/folder.json';

@Injectable()
export class SpaceService {
  currentSpace: Space;
  currentSpace$: BehaviorSubject<Space> = new BehaviorSubject<Space>(this.currentSpace);

  constructor(private http: HttpClient) {
  }

  loadSpace(spaceId: number): Observable<Space> {
    if (spaceId != undefined) {
      // todo make proper request
      this.http.get<Space>(SPACE_TEST_PATH).subscribe(space => {
        this.currentSpace = space;
        this.currentSpace$.next(this.currentSpace);
        console.log('loaded space: ' + spaceId);
      });
    }
    return this.currentSpace$;
  }

  /**
   * Loads a folder from the backend and puts it into a temporary space so everything still works properly.
   * @param folderId
   */
  loadFolder(folderId: number): BehaviorSubject<Space> {
    this.currentSpace = undefined;
    this.currentSpace$.next(undefined);
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

  convertFolderToPaths(folder: Folder): { idPath: string, namePath: string } {
    let paths = {idPath: folder.id + '', namePath: folder.name};
    let currentFolder = folder;
    while (currentFolder.parentId != 0) {
      currentFolder = this.getFolderFromSpace(currentFolder.parentId);
      paths.idPath += '/' + currentFolder.id;
      paths.namePath += '/' + currentFolder.name;
    }

    paths.idPath = SpaceService.reversePath(paths.idPath);
    paths.namePath = SpaceService.reversePath(paths.namePath);
    return paths;
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
    // we shall never arrive here. If we do, something went horribly wrong!
    console.error('Something went horribly wrong, trying to convert the following pathBits to a folder: '
      + pathBits + ' in the following base folder: ' + base.id);
  }
}
