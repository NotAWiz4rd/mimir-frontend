import {Component, OnInit, Inject} from '@angular/core';
import {StaticTextService} from '../../services/static-text.service';
import {LanguageService} from '../../services/language.service';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {CreateFolderDialogComponent} from '../create-folder-dialog/create-folder-dialog.component';

@Component({
  selector: 'app-rename-dialog',
  templateUrl: './rename-dialog.component.html',
  styleUrls: ['./rename-dialog.component.css']
})
export class RenameDialogComponent implements OnInit {
  name: string;
  type: string;

  constructor(public dialogRef: MatDialogRef<CreateFolderDialogComponent>,
              public staticTextService: StaticTextService,
              public languageService: LanguageService,
              @Inject(MAT_DIALOG_DATA) data) {
    this.type = data.type;
  }

  ngOnInit() {
  }

  onNoClick() {
    this.dialogRef.close();
  }

  /**
   * Checks whether wrong stuff (e.g. a '.') is used in a name.
   */
  wrongName(): boolean {
    if (this.name == undefined) {
      return true;
    }
    switch(this.type) {
      case 'folder':
        return this.name.includes('.');
      case 'file':
        return false;
      default:
        return true;
    }
  }
}
