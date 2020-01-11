import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {StaticTextService} from '../../services/static-text.service';
import {LanguageService} from '../../services/language.service';
import {ClipboardService} from '../../services/clipboard.service';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-copy-url-dialog',
  templateUrl: './copy-url-dialog.component.html',
  styleUrls: ['./copy-url-dialog.component.css']
})
export class CopyUrlDialogComponent implements OnInit {
  link: string;
  textGroup: FormGroup;

  constructor(public dialogRef: MatDialogRef<CopyUrlDialogComponent>,
              public staticTextService: StaticTextService,
              public languageService: LanguageService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.link = data.link;
    this.textGroup = new FormGroup({
      xxx: new FormControl()
    });
    this.textGroup.controls.xxx.disable();
  }

  ngOnInit() {
  }

  onCloseClick() {
    this.dialogRef.close();
  }

  copyTextToClipBoard() {
    ClipboardService.copyToClipboard(this.link);
  }
}
