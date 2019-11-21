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

  constructor(public spaceService: SpaceService,
              private folderService: FolderService,
              private navigationService: NavigationService,
              private route: ActivatedRoute,
              private fileService: FileService,
              public dialog: MatDialog,
              public _snackBar: MatSnackBar) {

    this.route.params.subscribe(params => {
      let lastSpaceId: number = this.spaceId;
      let lastFolderId: number = this.folderId;
      let lastFileId: number = this.fileId;

      if (params['fileId'] != undefined) {
        this.fileId = Number(params['fileId']);
      } else {
        this.fileId = undefined;
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

      if (this.fileId != undefined && this.spaceId == undefined && this.folderId == undefined) { // load file directly
        this.fileService.loadFile(this.fileId);
      } else if (this.fileId == undefined && this.spaceService.currentFolder != undefined && lastFileId != undefined && this.spaceId == lastSpaceId) { // recalculate path if we go back from a file
        this.navigationService.figureOutPaths(this.spaceService.currentFolder);
      }

      if (this.spaceId != undefined && this.spaceId != lastSpaceId) {
        if (this.spaceService.currentSpace == undefined || this.spaceService.currentSpace.id != this.spaceId) { // load new space
          this.spaceService.currentFolder = undefined;
          this.spaceService.loadSpace(this.spaceId);
          this.spaceService.currentSpace$.subscribe(space => {
            if (space != undefined && space.id == this.spaceId) {
              this.setCurrentFolder(this.folderService.getFolderFromSpace(this.folderId));
            }
          });
        } else {
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

      if (params['searchValue'] != undefined && this.searchValue != params['searchValue']) {
        this.searchValue = params['searchValue'];
        if (this.spaceService.currentFolder != undefined) {
          const filesAndFolders: [File[], Folder[]] = SearchService.collectMatchingFilesAndFolders(this.spaceService.currentFolder, this.searchValue);
          this.spaceService.currentFolder.artifacts = filesAndFolders[0];
          this.spaceService.currentFolder.folders = filesAndFolders[1];
        }
      } else if (params['searchValue'] == undefined) {
        this.searchValue = undefined;
      }
    });
  }

  ngOnInit() {
    this.fileService.currentFile$.subscribe(file => {
      if (file != undefined) {
        this.file = file;
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
        this.spaceService.loadSpace(this.spaceService.currentSpace.id, uploadSuccessful);
      }
    });
  }

  private setCurrentFolder(folder: Folder) {
    this.spaceService.currentFolder = folder;
    if (this.fileId == undefined) {
      this.navigationService.figureOutPaths(this.spaceService.currentFolder);
    }
  }

  calculateName(file: File): string {
    return file.name + '.' + file.contentType.split('/')[1];
  }

  doFolderAction(action: string, id: number) {
    switch (action) {
      case 'rename':
        // todo show rename dialog
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
            if (deleteAnyways) { // todo this doesnt work yet
              this.deleteFolder(id);
            }
          });
        } else {
          this.deleteFolder(id);
        }
        break;
      case 'download':
        this.folderService.download(id);
        break;
    }
  }

  private deleteFolder(id: number) {
    this.folderService.delete(id).subscribe(folderWasDeleted => {
      if (folderWasDeleted) {
        this.openSnackBar('Folder was deleted successfully');
      }
    });
  }

  doFileAction(action: string, id: number) {
    switch (action) {
      case 'rename':
        // todo show rename dialog
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
      duration: 1500,
    });
  }
}
