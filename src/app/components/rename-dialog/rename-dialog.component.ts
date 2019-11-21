import {Component, OnInit} from '@angular/core';
import {StaticTextService} from '../../services/static-text.service';
import {LanguageService} from '../../services/language.service';
import {MatDialogRef} from '@angular/material';
import {CreateFolderDialogComponent} from '../create-folder-dialog/create-folder-dialog.component';

@Component({
  selector: 'app-rename-dialog',
  templateUrl: './rename-dialog.component.html',
  styleUrls: ['./rename-dialog.component.css']
})
export class RenameDialogComponent implements OnInit {
  name: string;

  constructor(public dialogRef: MatDialogRef<CreateFolderDialogComponent>,
              public staticTextService: StaticTextService,
              public languageService: LanguageService) {
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
    return this.name.includes('.'); // using '.' in a name would confuse the path and navigation
  }
}
