import {Component, Input, OnInit} from '@angular/core';
import {File} from '../../classes/File';
import {FileDataService} from '../../services/file-data.service';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-file-view',
  templateUrl: './file-view.component.html',
  styleUrls: ['./file-view.component.css']
})
export class FileViewComponent implements OnInit {
  public Editor = ClassicEditor;
  @Input()
  file: File;
  contentFileType: String;
  isPicture: boolean;
  text: SafeHtml = 'test';

  fileUrl: string;

  constructor(private fileViewService: FileDataService,
              private domSanitizer: DomSanitizer) {
  }


  public onReady(editor) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

  ngOnInit() {
    this.contentFileType = this.getFileContentType();
    if (this.contentFileType.includes('jpg') || this.contentFileType.includes('png')){
      this.isPicture = true;
      this.setFileUrl();
    } else if (this.contentFileType.includes('txt')) {
      this.isPicture = false;
      this.setText();
    }
  }

  setFileUrl(): void {
    this.fileViewService.fetchImg(this.file.id).subscribe(base64Image => {
      this.fileUrl = base64Image;
    });
  }

  setText(): void{
    this.fileViewService.getTextFile(this.file.id).subscribe(data => {
      this.text = this.domSanitizer.bypassSecurityTrustHtml(data);
    });
  }

  getFileContentType(): String {
    const fileName = this.file.name.split('.');
    return fileName[fileName.length - 1];
  }

  editText() {

  }

}
