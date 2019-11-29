import {Component, OnInit} from '@angular/core';
import {LanguageService} from '../../services/language.service';
import {StaticTextService} from '../../services/static-text.service';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.css']
})
export class SettingsPageComponent implements OnInit {

  constructor(public languageService: LanguageService,
              public staticTextService: StaticTextService) {
  }

  ngOnInit() {
  }

}
