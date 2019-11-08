import {Component, Input, OnInit} from '@angular/core';
import {LanguageService} from '../../services/language.service';
import {NavigationService} from '../../services/navigation.service';
import {StaticTextService} from '../../services/static-text.service';

@Component({
  selector: 'app-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.css']
})
export class HeaderBarComponent implements OnInit {
  // the path within the current space
  currentPath: string = '';

  @Input()
  backButtonDisabled: boolean;

  constructor(public staticTextService: StaticTextService,
              public languageService: LanguageService,
              private navigationService: NavigationService) {
  }

  ngOnInit() {
    this.navigationService.namePath$.subscribe(path => {
      this.currentPath = path;
    });
  }

  onBackButtonClick() {
    if (this.currentPath.length > 1) {
      this.navigationService.navigateBack();
    }
  }

  onLogoutButtonClick() {
    // todo implement me
  }

  openSettings() {
    this.navigationService.navigateToSettings();
  }
}
