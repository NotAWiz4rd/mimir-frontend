import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Folder} from '../classes/Folder';
import {Space} from '../classes/Space';
import {SpaceService} from './space.service';
import {environment} from 'src/environments/environment';
import {UserService} from './user.service';
import {Router} from '@angular/router';
import {ErrorService} from './error.service';

@Injectable()
export class FolderService {
  baseUrl: string = environment.apiUrl + 'folder/';

  constructor(private http: HttpClient,
              private router: Router,
              private spaceService: SpaceService,
              public userService: UserService,
              private errorService: ErrorService) {
  }

  /**
   * Creates a new folder within the folder that the user is currently in.
   * @param name
   * @param parentId
   */
  createFolder(name: string, parentId: number): Observable<boolean> {
    let folderWasCreated = new BehaviorSubject(false);
    this.http.post(this.baseUrl + '?name=' + name + '&parentId=' + parentId, {}).subscribe(result => {
      let folder = result as Folder;
      if (folder.name == name) {
        let spaceFolder = FolderService.searchForFolder(this.spaceService.currentSpace.root, this.spaceService.currentFolder.id);
        if (spaceFolder.folders == undefined) { // create folders as empty array if it doesnt exist, then add the new folder
          spaceFolder.folders = [];
        }
        spaceFolder.folders.push(folder);
        this.spaceService.currentFolder = spaceFolder;
        folderWasCreated.next(true);
      }
    });
    return folderWasCreated;
  }

  /**
   * Loads a folder from the backend and puts it into a temporary space so everything still works properly.
   * @param folderId
   */
  loadFolderSpace(folderId: number): BehaviorSubject<Space> {
    if (this.spaceService.currentSpace != undefined) {
      for (let i = 0; i < this.spaceService.currentSpace.root.folders.length; i++) {
        if (this.spaceService.currentSpace.root.folders[i].id === folderId) {
          return this.spaceService.currentSpace$;
        }
      }
    }

    this.http.get<Folder>(this.baseUrl + folderId).subscribe(
      folder => {
        this.spaceService.currentSpace = new Space();
        this.spaceService.currentSpace.root = folder;
        this.spaceService.currentSpace.root.parentId = 0;
        this.spaceService.currentSpace.name = 'temp';
        this.spaceService.currentSpace$.next(this.spaceService.currentSpace);
      },
      error => this.errorService.handleError(error));
    return this.spaceService.currentSpace$;
  }

  loadFolder(folderId: number): Observable<Folder> {
    return this.http.get<Folder>(this.baseUrl + folderId);
  }

  reloadCurrentFolder() {
    this.loadFolder(this.spaceService.currentFolder.id).subscribe(replacementFolder => {
      this.spaceService.currentFolder = replacementFolder;
      this.spaceService.currentSpace.root = this.replaceFolderInCurrentSpace(replacementFolder, this.spaceService.currentSpace.root);
    });
  }

  replaceFolderInCurrentSpace(replacementFolder: Folder, base: Folder): Folder {
    if (base.id == replacementFolder.id) {
      return replacementFolder;
    } else {
      for (let i = 0; i < base.folders.length; i++) {
        base.folders[i] = this.replaceFolderInCurrentSpace(replacementFolder, base.folders[i]);
      }
      return base;
    }
  }

  delete(id: number, deleteWithContent: boolean = false): Observable<boolean> {
    let folderWasDeleted = new BehaviorSubject(false);
    this.http.delete(this.baseUrl + id + '?force=' + deleteWithContent).subscribe(result => {
      if (result == null) {
        this.reloadCurrentFolder();
        folderWasDeleted.next(true);
      }
    });
    return folderWasDeleted;
  }

  rename(id: number, name: string): Observable<boolean> {
    let folderWasRenamed = new BehaviorSubject(false);
    this.http.put(this.baseUrl + id + '/?name=' + name, {}).subscribe(() => {
      this.reloadCurrentFolder();
      folderWasRenamed.next(true);
    });
    return folderWasRenamed;
  }

  async download(id: number) {
    const response = await this.http.get<{ token: string }>(environment.apiUrl + 'folder/download/' + id).toPromise();
    const downloadToken = response.token;
    window.open(environment.apiUrl + 'folder/' + id + '/download?token=' + downloadToken);
  }

  getFolderFromSpace(id: number): Folder {
    return JSON.parse(JSON.stringify(FolderService.searchForFolder(this.spaceService.currentSpace.root, id))); // use deep copy of folder
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
    if (folder == null) {
      return '';
    }

    let namePath = folder.name;
    let currentFolder = folder;
    while (currentFolder != null && currentFolder.parentId != null) {
      currentFolder = this.getFolderFromSpace(currentFolder.parentId);
      if (currentFolder != null) {
        namePath += '/' + currentFolder.name;
      }
    }

    return FolderService.reversePath(namePath);
  }

  private static reversePath(str: string): string {
    return str.split('/').reverse().join('/');
  }

  convertPathToFolder(path: string): Folder {
    if (path.length === 0 || path.endsWith(this.spaceService.currentSpace.root.name)) {
      return this.spaceService.currentSpace.root;
    } else {
      path = path.replace(this.spaceService.currentSpace.root.name + '/', '');
    }

    let pathBits: string[] = path.split('/');

    return this.lookForNextPathBitWithin(this.spaceService.currentSpace.root, pathBits);
  }

  private lookForNextPathBitWithin(base: Folder, pathBits: string[]): Folder {
    for (let i = 0; i < base.folders.length; i++) {
      if (base.folders[i].name.toLowerCase() === pathBits[0].toLowerCase()) {
        // return folder if this is the last element of the pathBits
        if (pathBits.length === 1) {
          return base.folders[i];
        }

        return this.lookForNextPathBitWithin(base.folders[i], pathBits.slice(1));
      }
    }
    // check if we're in a file
    for (let i = 0; i < base.artifacts.length; i++) {
      if ((base.artifacts[i].name).toLowerCase() === pathBits[0].toLowerCase()) {
        return base;
      }
    }

    // we shall never arrive here. If we do, something went horribly wrong!
    console.error('Something went horribly wrong, trying to convert the following pathBits to a folder: '
      + pathBits + ' in the following base folder: ' + base.id);
  }

  /**
   * Copies a share link for the given folder to the clipboard.
   * @param id The folder id
   */
  async getShareLink(id: number) {
    const shareToken = await this.http.get<{ token: string }>(this.baseUrl + 'share/' + id).toPromise();
    return window.location.host + '/folder/' + id + '?token=' + shareToken.token;
  }
}
