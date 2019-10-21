import {Component, OnInit} from '@angular/core';
import {LanguageService} from '../../services/language.service';
import {Globals} from '../../util/Globals';

@Component({
  selector: 'app-action-bar',
  templateUrl: './action-bar.component.html',
  styleUrls: ['./action-bar.component.css']
})
export class ActionBarComponent implements OnInit {
  constructor(public globals: Globals,
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
