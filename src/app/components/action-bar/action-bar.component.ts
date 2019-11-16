import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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

  @Output()
  openCreateFolderDialog = new EventEmitter();

  constructor(public staticTextService: StaticTextService,
              public languageService: LanguageService) {
  }

  ngOnInit() {
  }

  onCreateFolderClick() {
    this.openCreateFolderDialog.emit();
  }

  onUploadFileClick() {
    // todo implement me
  }
}
