import {Component, OnInit} from '@angular/core';
import {SpaceService} from '../../services/space.service';
import {LanguageService} from '../../services/language.service';
import {StaticTextService} from '../../services/static-text.service';
import {User} from '../../classes/User';
import {FormControl, Validators} from '@angular/forms';

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
              public staticTextService: StaticTextService) {
    this.getSpaceUsers();
  }

  ngOnInit() {
  }

  async addUser(username: string) {
    await this.spaceService.addUserToCurrentSpace(username);
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
    });
  }
}
