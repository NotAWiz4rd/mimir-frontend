import {Injectable} from '@angular/core';
import {Folder} from '../classes/Folder';
import {Space} from '../classes/Space';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';

const SPACE_TEST_PATH = 'https://se.pfuetsch.xyz/space/';
const FOLDER_TEST_PATH = 'https://se.pfuetsch.xyz/folder';

@Injectable()
export class SpaceService {
  currentSpace: Space;
  currentSpace$: BehaviorSubject<Space> = new BehaviorSubject<Space>(this.currentSpace);

  currentFolder: Folder;

  constructor(private http: HttpClient) {
  }

  loadSpace(spaceId: number): Observable<Space> {
    if (spaceId != undefined && (this.currentSpace == undefined || (this.currentSpace.id != spaceId))) {
      // todo make proper request
      this.http.get<Space>(SPACE_TEST_PATH + spaceId).subscribe(space => {
        this.currentSpace = space;
        console.log('loaded space: ' + spaceId);
        this.currentSpace$.next(this.currentSpace);
      });
    }
    return this.currentSpace$;
  }

  /**
   * Creates a new folder within the folder that the user is currently in.
   * @param name
   * @param parentId
   */
  createFolder(name: string, parentId: number) {
    this.http.post(FOLDER_TEST_PATH + '?name=' + name + '&parentId=' + parentId, {}).subscribe(result => {
      let folder = result as Folder;
      if (folder.name == name) {
        this.currentFolder.folders.push(folder);
      }
    });
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

    this.http.get<Folder>(FOLDER_TEST_PATH + '/' + folderId).subscribe(folder => {
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
    while (currentFolder != null && currentFolder.parentId != null) {
      currentFolder = this.getFolderFromSpace(currentFolder.parentId);
      if (currentFolder != null) {
        namePath += '/' + currentFolder.name;
      }
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
    for (let i = 0; i < base.artifacts.length; i++) {
      if ((base.artifacts[i].name + '.' + base.artifacts[i].contentType.split('/')[1]).toLowerCase() === pathBits[0].toLowerCase()) {
        return base;
      }
    }

    // we shall never arrive here. If we do, something went horribly wrong!
    console.error('Something went horribly wrong, trying to convert the following pathBits to a folder: '
      + pathBits + ' in the following base folder: ' + base.id);
  }
}
