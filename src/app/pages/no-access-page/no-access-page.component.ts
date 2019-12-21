import {Component, OnInit} from '@angular/core';
import {NavigationService} from '../../services/navigation.service';
import {StaticTextService} from '../../services/static-text.service';
import {LanguageService} from '../../services/language.service';

@Component({
  selector: 'app-no-access-page',
  templateUrl: './no-access-page.component.html',
  styleUrls: ['./no-access-page.component.scss']
})
export class NoAccessPageComponent implements OnInit {

  constructor(public navigationService: NavigationService,
              public staticTextService: StaticTextService,
              public languageService: LanguageService) {
  }

  ngOnInit() {
  }
}
