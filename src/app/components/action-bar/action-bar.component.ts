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
  actionsDisabled = false;

  @Input()
  isSpaceRoot = false;

  @Output()
  openCreateFolderDialog = new EventEmitter();
  @Output()
  openUploadFileDialog = new EventEmitter();
  @Output()
  downloadSpaceEmitter = new EventEmitter();

  constructor(public staticTextService: StaticTextService,
              public languageService: LanguageService) {
  }

  ngOnInit() {
  }

  onCreateFolderClick() {
    this.openCreateFolderDialog.emit();
  }

  onUploadFileClick() {
    this.openUploadFileDialog.emit();
  }

  onDownloadSpaceClick() {
    this.downloadSpaceEmitter.emit();
  }
}
