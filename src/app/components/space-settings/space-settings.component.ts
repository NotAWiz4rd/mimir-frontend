import {Component, OnInit} from '@angular/core';
import {SpaceService} from '../../services/space.service';
import {LanguageService} from '../../services/language.service';
import {StaticTextService} from '../../services/static-text.service';
import {User} from '../../classes/User';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-space-settings',
  templateUrl: './space-settings.component.html',
  styleUrls: ['./space-settings.component.css']
})
export class SpaceSettingsComponent implements OnInit {
  emailFormControl = new FormControl('', [
    Validators.email,
  ]);

  matcher = new MailErrorStateMatcher();
  users: User[] = [];

  constructor(public spaceService: SpaceService,
              public languageService: LanguageService,
              public staticTextService: StaticTextService,
              private userService: UserService) {
    this.userService.getUsersByIds(this.spaceService.currentSpace.users).subscribe(users => {
      if (users != undefined) {
        this.users = users;
      }
    });
    // todo for testing only
    let user = new User();
    user.mail = 'test2@gmail.com';
    user.id = 15;
    user.username = 'testblub2';
    this.users = this.users.concat(user);
    let user2 = new User();
    user2.mail = 'test@gmail.com';
    user2.id = 15;
    user2.username = 'testblub';
    this.users = this.users.concat(user2);
  }

  ngOnInit() {
  }

  addUser(usermail: string) {
    this.spaceService.addUserToCurrentSpace(usermail).subscribe(users => {
      if (users != undefined) {
        this.users = users;
      }
    });
  }

  removeUser(id: number) {
    this.spaceService.removeUserFromCurrentSpace(id).subscribe(users => {
      if (users != undefined) {
        this.users = users;
      }
    });
  }
}

/** Error when invalid control is dirty, touched, or submitted. */
export class MailErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
