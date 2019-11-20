import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {StaticTextService} from '../../services/static-text.service';
import {LanguageService} from '../../services/language.service';

@Component({
  selector: 'app-create-space-dialog',
  templateUrl: './create-space-dialog.component.html',
  styleUrls: ['./create-space-dialog.component.css']
})
export class CreateSpaceDialogComponent implements OnInit {
  spaceName: string;

  constructor(public dialogRef: MatDialogRef<CreateSpaceDialogComponent>,
              public staticTextService: StaticTextService,
              public languageService: LanguageService) { }

  ngOnInit() {
  }

  onNoClick() {
    this.dialogRef.close();
  }

}
