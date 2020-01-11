import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {StaticTextService} from '../../services/static-text.service';
import {LanguageService} from '../../services/language.service';
import {ClipboardService} from '../../services/clipboard.service';

@Component({
  selector: 'app-copy-url-dialog',
  templateUrl: './copy-url-dialog.component.html',
  styleUrls: ['./copy-url-dialog.component.css']
})
export class CopyUrlDialogComponent implements OnInit {
  link: string;

  constructor(public dialogRef: MatDialogRef<CopyUrlDialogComponent>,
              public staticTextService: StaticTextService,
              public languageService: LanguageService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.link = data.link;
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
