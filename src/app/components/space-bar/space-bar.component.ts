import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UserService} from '../../services/user.service';
import {SpaceMetadata} from '../../classes/SpaceMetadata';
import {NavigationService} from '../../services/navigation.service';
import {LanguageService} from '../../services/language.service';
import {StaticTextService} from '../../services/static-text.service';
import {MatDialog} from '@angular/material';
import {SpaceService} from '../../services/space.service';
import {CreateSpaceDialogComponent} from '../create-space-dialog/create-space-dialog.component';


@Component({
  selector: 'app-space-bar',
  templateUrl: './space-bar.component.html',
  styleUrls: ['./space-bar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SpaceBarComponent implements OnInit {
  SPACE_CREATION_THUMBNAIL_ID: number = 1; // todo adjust this

  spaces: SpaceMetadata[] = [];

  constructor(private userService: UserService,
              private navigationService: NavigationService,
              public languageService: LanguageService,
              public staticTextService: StaticTextService,
              public dialog: MatDialog,
              private spaceService: SpaceService) {
    this.userService.currentUser$.subscribe(user => {
      if (user != undefined) {
        this.spaces = user.spaces;
      }
    });
  }

  ngOnInit() {
  }

  navigateToSpace(id: number) {
    this.navigationService.navigateToSpace(id);
  }

  openSpaceCreation() {
    const dialogRef = this.dialog.open(CreateSpaceDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.spaceService.createSpace(result).subscribe(spaceData => {
          if (spaceData != undefined) {
            this.userService.addSpaceToUser(spaceData);
            console.log('created space: ' + spaceData.id);
            this.navigationService.navigateToSpace(spaceData.id);
          }
        });
      }
    });
  }
}
