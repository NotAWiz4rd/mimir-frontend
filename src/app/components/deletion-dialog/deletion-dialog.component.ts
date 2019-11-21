import {Component, Inject, OnInit} from '@angular/core';
import {StaticTextService} from '../../services/static-text.service';
import {LanguageService} from '../../services/language.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {CreateFolderDialogComponent} from '../create-folder-dialog/create-folder-dialog.component';

@Component({
  selector: 'app-deletion-dialog',
  templateUrl: './deletion-dialog.component.html',
  styleUrls: ['./deletion-dialog.component.css']
})
export class DeletionDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<CreateFolderDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public entityKind: string,
              public staticTextService: StaticTextService,
              public languageService: LanguageService) {
  }

  ngOnInit() {
  }

  onNoClick() {
    this.dialogRef.close(false);
  }

}
