import {Component, OnInit} from '@angular/core';
import {SpaceService} from '../../services/space.service';
import {Folder} from '../../classes/Folder';
import {NavigationService} from '../../services/navigation.service';
import {ActivatedRoute} from '@angular/router';
import {FileService} from '../../services/file.service';
import {File} from '../../classes/File';

@Component({
  selector: 'app-content-page',
  templateUrl: './content-page.component.html',
  styleUrls: ['./content-page.component.css']
})
export class ContentPageComponent implements OnInit {
  currentRoot: Folder;
  folderId: number;
  spaceId: number;
  fileId: number;

  file: File;
  searchValue: string;

  constructor(private spaceService: SpaceService,
              private navigationService: NavigationService,
              private route: ActivatedRoute,
              private fileService: FileService) {

    this.route.params.subscribe(params => {

      if (params['fileId'] != undefined && this.fileId != Number(params['fileId'])) {
        this.fileId = Number(params['fileId']);
        this.fileService.loadFile(this.fileId);
      } else if (params['fileId'] == undefined) {
        this.fileId = undefined;
        if (this.currentRoot != undefined) {
          this.navigationService.figureOutPaths(this.currentRoot);
        }
      }

      if (params['spaceId'] != undefined && this.spaceId != Number(params['spaceId'])) {
        this.spaceId = Number(params['spaceId']);
        this.spaceService.loadSpace(params['spaceId']);
      } else if (params['spaceId'] == undefined) {
        this.spaceId = undefined;
      }

      if (params['folderId'] != undefined && this.folderId != Number(params['folderId']) && this.fileId == undefined) {
        this.folderId = Number(params['folderId']);
        if (this.currentRoot != undefined) {
          this.setCurrentRoot(this.spaceService.getFolderFromSpace(this.folderId));
        } else if (this.spaceId == undefined) {
          this.spaceService.loadFolder(this.folderId).subscribe(tempSpace => {
            if (tempSpace != undefined) {
              this.setCurrentRoot(tempSpace.root);
            }
          });
        }
      } else if (params['folderId'] == undefined) {
        this.folderId = undefined;
      }

      if (params['searchValue'] != undefined && this.searchValue != params['searchValue']) {
        this.searchValue = params['searchValue'];
        if(this.currentRoot != undefined){
          const filesAndFolders: [File[], Folder[]] = ContentPageComponent.collectMatchingFilesAndFolders(this.currentRoot, this.searchValue);
          this.currentRoot.files = filesAndFolders[0];
          this.currentRoot.folders = filesAndFolders[1];
        }
      } else if (params['searchValue'] == undefined) {
        this.searchValue = undefined;
      }
    });
  }

  ngOnInit() {
    if (this.spaceId != undefined) {
      this.spaceService.currentSpace$.subscribe(space => {
        if (space != undefined) {
          this.setCurrentRoot(this.spaceService.getFolderFromSpace(this.folderId));
        }
      });
    }

    this.fileService.currentFile$.subscribe(file => {
      if (file != undefined) {
        this.file = file;
      }
    });
  }

  navigateToFolder(id: number) {
    this.currentRoot.folders.forEach(folder => {
      if (folder.id === id) {
        this.navigationService.navigateWithinSpace(folder);
      }
    });
  }

  navigateToFile(id: number) {
    this.currentRoot.files.forEach(file => {
      if (file.id === id) {
        this.navigationService.navigateToFile(file, this.currentRoot);
      }
    });
  }

  private setCurrentRoot(folder: Folder) {
    this.currentRoot = folder;
    if (this.fileId == undefined) {
      this.navigationService.figureOutPaths(this.currentRoot);
    }
  }

  private static collectMatchingFilesAndFolders(base: Folder, searchValue: string): [File[], Folder[]] {
    let files: File[] = [];
    let folders: Folder[] = [];

    for (let i = 0; i < base.files.length; i++) {
      if (base.files[i].name.toLowerCase().includes(searchValue.toLowerCase())) {
        files.push(base.files[i]);
      }
    }

    for (let i = 0; i < base.folders.length; i++) {
      if (base.folders[i].name.toLowerCase().includes(searchValue.toLowerCase())) {
        folders.push(base.folders[i]);
      }
      let filesAndFolders: [File[], Folder[]] = this.collectMatchingFilesAndFolders(base.folders[i], searchValue);
      files.concat(filesAndFolders[0]);
      folders.concat(filesAndFolders[1]);
    }

    return [files, folders];
  }
}
