import {Component, OnInit} from '@angular/core';
import {SpaceService} from '../../services/space.service';
import {Folder} from '../../classes/Folder';
import {NavigationService} from '../../services/navigation.service';
import {ActivatedRoute} from '@angular/router';
import {FileService} from '../../services/file.service';
import {File} from '../../classes/File';
import {CreateFolderDialogComponent} from '../../components/create-folder-dialog/create-folder-dialog.component';
import {MatDialog, MatSnackBar} from '@angular/material';
import {SearchService} from '../../services/search.service';
import {UploadFileDialogComponent} from '../../components/upload-file-dialog/upload-file-dialog.component';
import {FolderService} from '../../services/folder.service';
import {DeletionDialogComponent} from '../../components/deletion-dialog/deletion-dialog.component';
import {RenameDialogComponent} from '../../components/rename-dialog/rename-dialog.component';
import {LanguageService} from '../../services/language.service';

@Component({
  selector: 'app-content-page',
  templateUrl: './content-page.component.html',
  styleUrls: ['./content-page.component.css']
})
export class ContentPageComponent implements OnInit {
  folderId: number;
  spaceId: number;
  fileId: number;

  file: File;
  searchValue: string;
  isSpaceSettings: boolean = false;
  isSettings: boolean = false;

  constructor(public spaceService: SpaceService,
              private folderService: FolderService,
              private navigationService: NavigationService,
              private route: ActivatedRoute,
              private fileService: FileService,
              public languageService: LanguageService,
              public dialog: MatDialog,
              public _snackBar: MatSnackBar) {
    this.route.params.subscribe(params => {
      if (this.route.toString().includes('url:\'settings\',')) { // check whether we should be showing the settings page
        this.isSettings = true;
        return;
      } else {
        this.isSettings = false;
      }

      let lastSpaceId: number = this.spaceId;
      let lastFolderId: number = this.folderId;
      let lastFileId: number = this.fileId;

      if (params['fileId'] != undefined) {
        this.fileId = Number(params['fileId']);
        this.fileService.loadFile(this.fileId);
      } else {
        this.fileId = undefined;
        this.file = undefined;
      }

      if (params['folderId'] != undefined) {
        this.folderId = Number(params['folderId']);
      } else {
        this.folderId = undefined;
      }

      if (params['spaceId'] != undefined) {
        this.spaceId = Number(params['spaceId']);
      } else {
        this.spaceId = undefined;
      }

      if (this.fileId != undefined) { // load file directly
        this.fileService.loadFile(this.fileId);
      } else if (this.fileId == undefined && this.spaceService.currentFolder != undefined && lastFileId != undefined && this.spaceId == lastSpaceId) { // recalculate path if we go back from a file
        this.navigationService.figureOutPaths(this.spaceService.currentFolder);
      }

      if (this.spaceId != undefined && this.spaceId != lastSpaceId) {
        if (this.spaceService.currentSpace == undefined || this.spaceService.currentSpace.id != this.spaceId) { // load new space
          this.spaceService.currentFolder = undefined;
          this.spaceService.loadSpace(this.spaceId);
          this.spaceService.currentSpace$.subscribe(space => {
            if (this.route.toString().includes('settings')) { // space settings
              this.isSpaceSettings = true;
              this.navigationService.namePath$.next(space.name);
            } else if (space != undefined && space.id == this.spaceId) {
              this.setCurrentFolder(this.folderService.getFolderFromSpace(this.folderId));
            }
          });
        } else if (this.spaceId != undefined && this.route.toString().includes('settings')) { // space settings
          this.isSpaceSettings = true;
        } else if (this.folderId != null) {
          this.setCurrentFolder(this.folderService.getFolderFromSpace(this.folderId));
        }
      }

      if (this.folderId != undefined && this.folderId != lastFolderId && this.spaceService.currentFolder != undefined) {
        this.setCurrentFolder(this.folderService.getFolderFromSpace(this.folderId));
      } else if (this.folderId != undefined && this.spaceId == undefined && this.folderId != lastFolderId) { // direct folder access
        this.folderService.loadFolderSpace(this.folderId).subscribe(tempSpace => {
          if (tempSpace != undefined) {
            this.setCurrentFolder(tempSpace.root);
          }
        });
      }

      if (params['searchValue'] != undefined && this.searchValue != params['searchValue']) { // searchValue has changed
        this.searchValue = params['searchValue'];
        if (this.spaceService.currentFolder != undefined) {
          const filesAndFolders: [File[], Folder[]] = SearchService.collectMatchingFilesAndFolders(this.spaceService.currentFolder, this.searchValue);
          this.spaceService.currentFolder.artifacts = filesAndFolders[0];
          this.spaceService.currentFolder.folders = filesAndFolders[1];
        }
      } else if (params['searchValue'] == undefined) { // no search value
        if (this.searchValue != undefined) { // coming back from a search
          this.setCurrentFolder(this.folderService.getFolderFromSpace(this.folderId));
        }
        this.searchValue = undefined;
      }
    });
  }

  ngOnInit() {
    this.fileService.currentFile$.subscribe(file => {
      if (file != undefined) {
        this.file = file;

        if (this.folderId == undefined && !this.isSettings) {
          this.navigationService.namePath$.next(this.file.name);
        }
      }
    });
  }

  navigateToFolder(id: number) {
    this.spaceService.currentFolder.folders.forEach(folder => {
      if (folder.id === id) {
        this.navigationService.navigateWithinSpace(folder.id);
      }
    });
  }

  navigateToFile(id: number) {
    this.spaceService.currentFolder.artifacts.forEach(file => {
      if (file.id === id) {
        this.navigationService.navigateToFile(file, this.spaceService.currentFolder);
        return;
      }
    });
  }

  createFolderDialog() {
    const dialogRef = this.dialog.open(CreateFolderDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.folderService.createFolder(result, this.spaceService.currentFolder.id).subscribe(folderWasCreated => {
          if (folderWasCreated) {
            this.openSnackBar('Folder was created successfully');
          }
        });
      }
    });
  }

  uploadFileDialog() {
    const dialogRef = this.dialog.open(UploadFileDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(uploadSuccessful => {
      if (uploadSuccessful) {
        this.folderService.reloadCurrentFolder();
      }
    });
  }

  private setCurrentFolder(folder: Folder) {
    this.spaceService.currentFolder = folder;
    if (this.fileId == undefined) {
      this.navigationService.figureOutPaths(this.spaceService.currentFolder);
    }
  }

  async doFolderAction(action: string, id: number) {
    switch (action) {
      case 'rename':
        const dialogRef = this.dialog.open(RenameDialogComponent, {
          width: '400px',
          data: {
            type: 'folder'
          }
        });
        dialogRef.afterClosed().subscribe(newName => {
          if (newName != undefined) {
            this.folderService.rename(id, newName);
          }
        });
        break;
      case 'delete':
        // if folder has content, ask user to confirm deletion first
        let folder = this.folderService.getFolderFromSpace(id);
        if ((folder.folders != undefined && folder.folders.length != 0) || (folder.artifacts != undefined && folder.artifacts.length != 0)) {
          const dialogRef = this.dialog.open(DeletionDialogComponent, {
            width: '400px',
            data: 'folder'
          });

          dialogRef.afterClosed().subscribe(deleteAnyways => {
            if (deleteAnyways) {
              this.deleteFolder(id, true);
            }
          });
        } else {
          this.deleteFolder(id);
        }
        break;
      case 'download':
        this.folderService.download(id);
        break;
      case 'share':
        await this.folderService.share(id);
        this.openSnackBar('Link was copied to clipboard');
        break;
    }
  }

  private deleteFolder(id: number, deleteWithContent: boolean = false) {
    this.folderService.delete(id, deleteWithContent).subscribe(folderWasDeleted => {
      if (folderWasDeleted) {
        this.openSnackBar('Folder was deleted successfully');
      }
    });
  }

  async doFileAction(action: string, id: number) {
    switch (action) {
      case 'rename':
        const dialogRef = this.dialog.open(RenameDialogComponent, {
          width: '400px',
          data: {
            type: 'file'
          }
        });
        dialogRef.afterClosed().subscribe(newName => {
          if (newName != undefined) {
            this.fileService.rename(id, newName);
          }
        });
        break;
      case 'delete':
        this.fileService.delete(id).subscribe(fileWasDeleted => {
          if (fileWasDeleted) {
            this.openSnackBar('File was deleted successfully');
          }
        });
        break;
      case 'download':
        this.fileService.download(id);
        break;
      case 'share':
        await this.fileService.share(id);
        this.openSnackBar('Link was copied to clipboard');
        break;
    }
  }

  /**
   * Downloads a space by downloading the root folder of the space that is currently loaded.
   */
  downloadSpace() {
    this.folderService.download(this.spaceService.currentSpace.root.id);
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, null, {
      duration: 1750,
    });
  }
}
