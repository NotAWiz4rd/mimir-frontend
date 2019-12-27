import {Component, Input, OnInit} from '@angular/core';
import {File} from '../../classes/File';
import {FileDataService} from '../../services/file-data.service';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {ReuploadService} from '../../services/reupload.service';
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
  text;
  editableText;
  isDisabled = true;

  fileUrl: string;

  constructor(private fileViewService: FileDataService,
              public reuploadService: ReuploadService,
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
      this.text = data;
      // workaround as otherwise in the ckeditor it is undefined
      this.editableText = this.text.changingThisBreaksApplicationSecurity;
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
    this.reuploadService.reupload(blob, filename, this.file.id);
    }

  expFile() {
    const fileText = this.editableText;
    const fileName = this.file.name;
    console.log('Saving file: ' + fileName + ' with text: ' + fileText);
    this.saveTextAsFile(fileText, fileName);
  }
}
