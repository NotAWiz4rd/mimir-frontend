import {Component, OnInit} from '@angular/core';
import {Globals} from '../../util/Globals';
import {LanguageService} from '../../services/language.service';

@Component({
  selector: 'app-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.css']
})
export class HeaderBarComponent implements OnInit {

  constructor(public globals: Globals,
              public languageService: LanguageService) {
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
    // todo implement me
  }
}
