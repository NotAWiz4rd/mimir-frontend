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

  constructor(private spaceService: SpaceService,
              private navigationService: NavigationService,
              private route: ActivatedRoute,
              private fileService: FileService) {

    this.route.params.subscribe(params => {

      if (params['fileId'] != undefined && this.fileId != Number(params['fileId'])) {
        this.fileId = Number(params['fileId']);
        this.fileService.loadFile(this.fileId);
        // todo path isnt recalculated when going back to a file via the back button
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
}
