import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {StaticTextService} from '../../services/static-text.service';
import {LanguageService} from '../../services/language.service';

@Component({
  selector: 'app-create-folder-dialog',
  templateUrl: './create-folder-dialog.component.html',
  styleUrls: ['./create-folder-dialog.component.css']
})
export class CreateFolderDialogComponent implements OnInit {
  folderName: string;

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
   * Checks whether wrong stuff (e.g. a '.') is used in a folders name.
   */
  wrongName() {
    if (this.folderName == undefined) {
      return false;
    }
    return this.folderName.includes('.'); // using '.' in a folders name would confuse the path and navigation
  }
}
