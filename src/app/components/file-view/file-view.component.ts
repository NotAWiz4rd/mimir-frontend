import {Component, Input, OnInit} from '@angular/core';
import {File} from '../../classes/File';
import {FileDataService} from "../../services/file-data.service";
import {SafeHtml} from "@angular/platform-browser";
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {StaticTextService} from "../../services/static-text.service";
import {LanguageService} from "../../services/language.service";

@Component({
  selector: 'app-file-view',
  templateUrl: './file-view.component.html',
  styleUrls: ['./file-view.component.css']
})
export class FileViewComponent implements OnInit {
  @Input()
  file: File;
  public Editor = ClassicEditor;
  contentFileType: String;
  isPicture: boolean;
  text: SafeHtml = 'test';

  fileUrl: string = 'https://media.giphy.com/media/sSgvbe1m3n93G/source.gif';

  constructor(private fileDataService: FileDataService,
              public staticTextService: StaticTextService,
              public languageService: LanguageService) {
  }


  ngOnInit() {
    this.contentFileType = this.getFileContentType();
    if (this.contentFileType.includes('jpg') || this.contentFileType.includes('png')) {
      this.isPicture = true;
      this.setFileUrl();
    } else if (this.contentFileType.includes('txt')) {
      this.isPicture = false;
      this.setText();
    }
  }

  setFileUrl(): void {
    this.fileDataService.fetchImg(this.file.id).subscribe(base64Image => {
      this.fileUrl = base64Image;
    });
  }

  setText(): void {
    this.fileDataService.getTextFile(this.file.id).subscribe(data => {
      this.text = data;
    });
  }

  getFileContentType(): String {
    const fileName = this.file.name.split('.');
    return fileName[fileName.length - 1];
  }

  editText() {

  }

}
