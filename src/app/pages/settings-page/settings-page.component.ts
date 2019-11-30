import {Component, Input, OnInit} from '@angular/core';
import {LanguageService} from '../../services/language.service';
import {StaticTextService} from '../../services/static-text.service';
import {UserService} from '../../services/user.service';
import {NavigationService} from '../../services/navigation.service';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.css']
})
export class SettingsPageComponent implements OnInit {
  @Input()
  language: string;

  constructor(public languageService: LanguageService,
              public staticTextService: StaticTextService,
              public userService: UserService,
              private navigationService: NavigationService) {
  }

  ngOnInit() {
  }

  onDeleteButtonClick() {
    this.userService.delete();
    this.navigationService.navigateToView('');
  }

  onChangePasswordButtonClick() {
    // todo open password change dialog
  }
}
