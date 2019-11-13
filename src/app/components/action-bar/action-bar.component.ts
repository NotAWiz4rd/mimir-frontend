import {Component, Input, OnInit} from '@angular/core';
import {LanguageService} from '../../services/language.service';
import {StaticTextService} from '../../services/static-text.service';

@Component({
  selector: 'app-action-bar',
  templateUrl: './action-bar.component.html',
  styleUrls: ['./action-bar.component.css']
})
export class ActionBarComponent implements OnInit {

  @Input()
  actionsDisabled: boolean = false;

  constructor(public staticTextService: StaticTextService,
              public languageService: LanguageService) {
  }

  ngOnInit() {
  }

  onCreateFolderClick() {
    // todo implement me
  }

  onUploadFileClick() {
    // todo implement me
  }
}
