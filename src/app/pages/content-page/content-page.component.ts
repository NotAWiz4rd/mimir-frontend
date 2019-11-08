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

      if (params['spaceId'] != undefined && this.spaceId != Number(params['spaceId'])) {
        this.spaceId = Number(params['spaceId']);
        this.spaceService.loadSpace(params['spaceId']);
      } else if (params['spaceId'] == undefined) {
        this.spaceId = params['spaceId'];
      }


      if (params['folderId'] != undefined && this.folderId != Number(params['folderId'])) {
        this.folderId = Number(params['folderId']);
        if (this.currentRoot != undefined) {
          this.currentRoot = this.spaceService.getFolderFromSpace(this.folderId);
          this.navigationService.figureOutPaths(this.currentRoot);
        } else if (this.spaceId == undefined) {
          this.spaceService.loadFolder(this.folderId).subscribe(tempSpace => {
            if (tempSpace != undefined) {
              this.currentRoot = tempSpace.root;
            }
          });
        }
      } else if (params['folderId'] == undefined) {
        this.folderId = params['folderId'];
      }

      if (params['fileId'] != undefined && this.fileId != Number(params['fileId'])) {
        this.fileId = Number(params['fileId']);
        this.fileService.loadFile(this.fileId).subscribe(file => {
          this.file = file;
        });
      } else if (params['fileId'] == undefined) {
        this.fileId = params['fileId'];
      }
    });
  }

  ngOnInit() {
    if (this.spaceId != undefined) {
      this.spaceService.currentSpace$.subscribe(space => {
        if (space != undefined) {
          this.currentRoot = this.spaceService.getFolderFromSpace(this.folderId);
          this.navigationService.figureOutPaths(this.currentRoot);
        }
      });
    }
  }

  navigateToFolder(id: number) {
    this.currentRoot.folders.forEach(folder => {
      if (folder.id === id) {
        this.navigationService.navigateWithinSpace(folder);
      }
    });
  }
}
