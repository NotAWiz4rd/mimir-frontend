import {Component, OnInit} from '@angular/core';
import {Globals} from '../../util/Globals';
import {LanguageService} from '../../services/language.service';
import {NavigationService} from '../../services/navigation.service';

@Component({
  selector: 'app-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.css']
})
export class HeaderBarComponent implements OnInit {
  currentPath: string;

  constructor(public globals: Globals,
              public languageService: LanguageService,
              private navigationService: NavigationService) {
  }

  ngOnInit() {
  }

  onBackButtonClick() {
    // todo implement me
  }

  onLogoutButtonClick() {
    // todo implement me
  }

  openSettings() {
    this.navigationService.navigateToSettings();
  }
}
