import {Component, OnInit} from '@angular/core';
import {SpaceService} from '../../services/space.service';
import {Folder} from '../../classes/Folder';
import {NavigationService} from '../../services/navigation.service';
import {ActivatedRoute} from '@angular/router';
import {FileService} from '../../services/file.service';
import {File} from '../../classes/File';
import {CreateFolderDialogComponent} from '../../components/create-folder-dialog/create-folder-dialog.component';
import {MatDialog} from '@angular/material';
import {SearchService} from '../../services/search.service';
import {UploadFileDialogComponent} from "../../components/upload-file-dialog/upload-file-dialog.component";

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
              private navigationService: NavigationService,
              private route: ActivatedRoute,
              private fileService: FileService,
              public dialog: MatDialog) {

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
              this.setCurrentFolder(this.spaceService.getFolderFromSpace(this.folderId));
            }
          });
        } else {
          this.setCurrentFolder(this.spaceService.getFolderFromSpace(this.folderId));
        }
      }

      if (this.folderId != undefined && this.folderId != lastFolderId && this.spaceService.currentFolder != undefined) {
        this.setCurrentFolder(this.spaceService.getFolderFromSpace(this.folderId));
      } else if (this.folderId != undefined && this.spaceId == undefined && this.folderId != lastFolderId) { // direct folder access
        this.spaceService.loadFolder(this.folderId).subscribe(tempSpace => {
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
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.spaceService.createFolder(result, this.spaceService.currentFolder.id);
      }
    });
  }

  uploadFileDialog(){
    const dialogRef = this.dialog.open(UploadFileDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(uploadSuccessful => {
      if(uploadSuccessful == true){
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
}
