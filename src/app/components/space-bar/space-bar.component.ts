import {Component, OnInit, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation} from '@angular/core';
import {UserService} from '../../services/user.service';
import {SpaceMetadata} from '../../classes/SpaceMetadata';
import {NavigationService} from '../../services/navigation.service';
import {LanguageService} from '../../services/language.service';
import {StaticTextService} from '../../services/static-text.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {SpaceService} from '../../services/space.service';
import {CreateSpaceDialogComponent} from '../create-space-dialog/create-space-dialog.component';
import {TemplatePortal} from '@angular/cdk/portal';
import {Overlay, OverlayRef} from '@angular/cdk/overlay';
import {fromEvent, Subscription} from 'rxjs';
import {filter, take} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-space-bar',
  templateUrl: './space-bar.component.html',
  styleUrls: ['./space-bar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SpaceBarComponent implements OnInit {
  SPACE_CREATION_THUMBNAIL_ID: number = -1;

  @ViewChild('spaceMenu') spaceMenu: TemplateRef<any>;
  sub: Subscription;
  overlayRef: OverlayRef | null;

  spaces: SpaceMetadata[] = [];

  constructor(private userService: UserService,
              private navigationService: NavigationService,
              public languageService: LanguageService,
              public staticTextService: StaticTextService,
              public dialog: MatDialog,
              private spaceService: SpaceService,
              private route: ActivatedRoute,
              public _snackBar: MatSnackBar,
              public overlay: Overlay,
              public viewContainerRef: ViewContainerRef) {
    this.userService.currentUser$.subscribe(user => {
      if (user != undefined) {
        this.spaces = user.spaces;
      }
    });
  }

  ngOnInit() {
  }

  navigateToSpace(id: number) {
    this.navigationService.navigateToSpace(id, this.route.toString().includes('settings'));
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
            this.openSnackBar('Space was created successfully');
            this.navigationService.navigateToSpace(spaceData.id);
          }
        });
      }
    });
  }

  openSpaceSettings(id: number) {
    this.close();
    this.navigationService.navigateToSpaceSettings(id);
  }

  deleteSpace(id: number) {
    this.close();
    this.spaceService.delete(id).subscribe(result => {
      if (result != '') {
        this.openSnackBar(result);
        const otherSpaceId = this.userService.getDifferentSpaceId();
        if (otherSpaceId != -1) {
          this.navigationService.navigateToSpace(otherSpaceId);
          this.userService.reloadUser();
        } else { // if there are no other spaces available create a new one and navigate there
          this.spaceService.createSpace(this.userService.currentUser$.getValue().name).subscribe(spaceMetaData => {
            this.userService.addSpaceToUser(spaceMetaData);
            this.navigationService.navigateToSpace(spaceMetaData.id);
            this.userService.reloadUser();
          });
        }
      }
    });
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, null, {
      duration: 1750,
    });
  }

  open(event: MouseEvent, space: SpaceMetadata) {
    event.preventDefault();
    this.close();
    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo(event)
      .withPositions([
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top',
        }
      ]);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.close()
    });

    this.overlayRef.attach(new TemplatePortal(this.spaceMenu, this.viewContainerRef, {
      $implicit: space
    }));

    this.sub = fromEvent<MouseEvent>(document, 'click')
      .pipe(
        filter(event => {
          const clickTarget = event.target as HTMLElement;
          return !!this.overlayRef && !this.overlayRef.overlayElement.contains(clickTarget);
        }),
        take(1)
      ).subscribe(() => this.close());
  }

  close() {
    this.sub && this.sub.unsubscribe();
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }
}
