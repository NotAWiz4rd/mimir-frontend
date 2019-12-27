import {Component, OnInit} from '@angular/core';
import {SpaceService} from '../../services/space.service';
import {LanguageService} from '../../services/language.service';
import {StaticTextService} from '../../services/static-text.service';
import {User} from '../../classes/User';
import {FormControl, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import {NavigationService} from '../../services/navigation.service';
import {UserService} from '../../services/user.service';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-space-settings',
  templateUrl: './space-settings.component.html',
  styleUrls: ['./space-settings.component.css']
})
export class SpaceSettingsComponent implements OnInit {
  formControl = new FormControl('', [
    Validators.required,
  ]);

  users: User[] = [];

  constructor(public spaceService: SpaceService,
              public languageService: LanguageService,
              public staticTextService: StaticTextService,
              public _snackBar: MatSnackBar,
              private navigationService: NavigationService,
              private userService: UserService) {
    this.getSpaceUsers();
  }

  ngOnInit() {
  }

  async addUser(username: string) {
    try {
      await this.spaceService.addUserToCurrentSpace(username);
    } catch (e) {
      this.openSnackBar(e.message);
    }
    this.getSpaceUsers();
  }

  async removeUser(id: number) {
    await this.spaceService.removeUserFromCurrentSpace(id);
    this.getSpaceUsers();
  }

  getSpaceUsers() {
    this.spaceService.getUsersOfCurrentSpace().subscribe(users => {
      if (users != undefined) {
        this.users = users;
      }
    }, error => this.handleError(error));
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, null, {
      duration: 1750,
    });
  }

  handleError(error: HttpErrorResponse) {
    if (error.status == 403) {
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
  }
}
