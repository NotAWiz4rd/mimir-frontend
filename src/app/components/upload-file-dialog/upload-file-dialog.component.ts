import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {StaticTextService} from '../../services/static-text.service';
import {LanguageService} from '../../services/language.service';
import {forkJoin} from 'rxjs';
import {UploadService} from '../../services/upload.service';
import {SpaceService} from "../../services/space.service";

@Component({
  selector: 'app-upload-file-dialog',
  templateUrl: './upload-file-dialog.component.html',
  styleUrls: ['./upload-file-dialog.component.css']
})
export class UploadFileDialogComponent implements OnInit {
  @ViewChild('file', {static: true}) file;
  public files: Set<File> = new Set();
  progress;
  showCancelButton = true;
  uploading = false;
  uploadSuccessful = false;

  constructor(public dialogRef: MatDialogRef<UploadFileDialogComponent>,
              public uploadService: UploadService,
              public spaceService: SpaceService,
              public staticTextService: StaticTextService,
              public languageService: LanguageService) {
  }

  ngOnInit() {
  }

  addFiles() {
    this.file.nativeElement.click();
  }

  onFilesAdded() {
    const files: { [key: string]: File } = this.file.nativeElement.files;
    for (let key in files) {
      if (!isNaN(parseInt(key))) {
        this.files.add(files[key]);
      }
    }
  }

  uploadFiles() {
    // if everything was uploaded already, just close the dialog
    if (this.uploadSuccessful) {
      return this.dialogRef.close();
    }

    // set the component state to "uploading"
    this.uploading = true;

    // start the upload and save the progress map
    this.progress = this.uploadService.upload(this.files, this.spaceService.currentFolder.id);

    // convert the progress map into an array
    let allProgressObservables = [];
    for (let key in this.progress) {
      allProgressObservables.push(this.progress[key].progress);
    }

    // The dialog should not be closed while uploading
    this.dialogRef.disableClose = true;
    this.showCancelButton = false;

    forkJoin(allProgressObservables).subscribe(end => {
      this.dialogRef.disableClose = false;
      this.uploadSuccessful = true;
      this.uploading = false;
      this.dialogRef.close(true);
    }, () => {
      this.uploading = false;
      this.showCancelButton = true;
      this.dialogRef.disableClose = false;
      this.progress = null;
      this.files = new Set();
    });
  }
}
