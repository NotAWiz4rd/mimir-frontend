import {Component, OnInit} from '@angular/core';
import {SpaceService} from '../../services/space.service';
import {LanguageService} from '../../services/language.service';
import {StaticTextService} from '../../services/static-text.service';

@Component({
  selector: 'app-space-settings',
  templateUrl: './space-settings.component.html',
  styleUrls: ['./space-settings.component.css']
})
export class SpaceSettingsComponent implements OnInit {
  constructor(public spaceService: SpaceService,
              public languageService: LanguageService,
              public staticTextService: StaticTextService) {
  }

  ngOnInit() {
  }
}
