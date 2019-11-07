import {Component, OnInit} from '@angular/core';
import {SpaceService} from '../../services/space.service';
import {Folder} from '../../classes/Folder';
import {NavigationService} from '../../services/navigation.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-content-page',
  templateUrl: './content-page.component.html',
  styleUrls: ['./content-page.component.css']
})
export class ContentPageComponent implements OnInit {
  currentRoot: Folder;
  folderId: number = 0;
  spaceId: number = 0;

  constructor(private spaceService: SpaceService,
              private navigationService: NavigationService,
              private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      if (this.spaceId != Number(params['spaceId'])) {
        this.spaceService.loadSpace(params['spaceId']);
        this.spaceId = Number(params['spaceId']);
      }

      if (this.folderId != Number(params['folderId'])) {
        this.folderId = Number(params['folderId']);
        if (this.currentRoot != undefined) {
          this.currentRoot = this.spaceService.getFolder(this.folderId);
          this.navigationService.figureOutPaths(this.currentRoot);
        }
      }
    });
  }

  ngOnInit() {
    this.spaceService.currentSpace$.subscribe(space => {
      if (space != undefined) {
        this.currentRoot = this.spaceService.getFolder(this.folderId);
        this.navigationService.figureOutPaths(this.currentRoot);
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
}
