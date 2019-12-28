import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
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
  @ViewChild("videoPlayer") videoPlayer: ElementRef;
  public Editor = ClassicEditor;
  fileType: String;
  urlIsSet: Promise<boolean>;
  text: SafeHtml = 'test';

  fileUrl: string = 'https://media.giphy.com/media/sSgvbe1m3n93G/source.gif';

  constructor(private fileDataService: FileDataService,
              public staticTextService: StaticTextService,
              public languageService: LanguageService) {
  }


  ngOnInit() {
    this.fileType = this.getFileType();
    if (this.fileType.includes('jpg') || this.fileType.includes('png') || this.fileType.includes('pdf')) {
      this.setFileUrl();
    } else if (this.fileType.includes('mp4')) {
      this.setFileUrl();
    } else if (this.fileType.includes('txt')) {
      this.setText();
    }
  }

  setFileUrl(): void {
    this.fileDataService.fetchFile(this.file.id).subscribe(base64Image => {
      this.fileUrl = base64Image;
      this.urlIsSet = Promise.resolve(true);
    });
  }

  setText(): void {
    this.fileDataService.getTextFile(this.file.id).subscribe(data => {
      this.text = data;
    });
  }

  getFileType(): String {
    const fileName = this.file.name.split('.');
    return fileName[fileName.length - 1];
  }

  toggleVideo() {
    this.videoPlayer.nativeElement.play();
  }

  editText() {

  }

}
