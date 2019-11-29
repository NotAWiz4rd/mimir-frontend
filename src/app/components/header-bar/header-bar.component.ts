import {Component, Input, OnInit} from '@angular/core';
import {LanguageService} from '../../services/language.service';
import {NavigationService} from '../../services/navigation.service';
import {StaticTextService} from '../../services/static-text.service';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.css']
})
export class HeaderBarComponent implements OnInit {
  @Input()
  isSettings: boolean = false;

  // the path within the current space
  currentPath: string = '';

  @Input()
  backButtonDisabled: boolean;

  constructor(public staticTextService: StaticTextService,
              public languageService: LanguageService,
              private navigationService: NavigationService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.navigationService.namePath$.subscribe(path => {
      this.currentPath = path;
    });
  }

  onBackButtonClick() {
    if (this.isSettings) {
      this.navigationService.navigateBack();
    } else {
      this.navigationService.navigateUp(this.currentPath);
    }
  }

  onLogoutButtonClick() {
    this.userService.logout();
    this.navigationService.navigateToView('login');
  }

  openSettings() {
    this.navigationService.navigateToSettings();
  }

  pathTooShort() {
    return this.currentPath.split('/').length < 2;
  }
}
