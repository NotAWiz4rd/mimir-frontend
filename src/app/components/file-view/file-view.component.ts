import {Component, Input, OnInit} from '@angular/core';
import {File} from '../../classes/File';
import {FileDataService} from '../../services/file-data.service';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {UploadService} from '../../services/upload.service';
import {SpaceService} from '../../services/space.service';

@Component({
  selector: 'app-file-view',
  templateUrl: './file-view.component.html',
  styleUrls: ['./file-view.component.css']
})
export class FileViewComponent implements OnInit {
  public Editor = ClassicEditor;
  editorConfig = {
    placeholder: 'Type the content here!',
  };
  @Input()
  file: File;
  contentFileType: String;
  isPicture: boolean;
  text: SafeHtml;
  public isDisabled = true;
  workingText;

  fileUrl: string;

  constructor(private fileViewService: FileDataService,
              private domSanitizer: DomSanitizer,
              public uploadService: UploadService,
              public spaceService: SpaceService) {
  }

  public onReady(editor) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
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
    this.fileViewService.fetchImg(this.file.id).subscribe(base64Image => {
      this.fileUrl = base64Image;
    });
  }

  setText(): void {
    this.fileViewService.getTextFile(this.file.id).subscribe(data => {
      // this.text = this.domSanitizer.bypassSecurityTrustHtml(data);
      this.text = data['changingThisBreaksApplicationSecurity'];
      this.workingText = this.text.toString();
    });
  }

  getFileContentType(): String {
    const fileName = this.file.name.split('.');
    return fileName[fileName.length - 1];
  }

  toggleEditing() {
    this.isDisabled = !this.isDisabled;
  }

  saveTextAsFile(data, filename) {
    if (!data) {
      console.error('no data');
      return;
    }
    const blob = new Blob([data], {type: 'text/plain'});
    }

  expFile() {
    const fileText = this.workingText;
    const fileName = this.file.name;
    this.saveTextAsFile(fileText, fileName);
  }
}
