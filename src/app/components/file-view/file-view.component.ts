import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {File} from '../../classes/File';
import {FileDataService} from '../../services/file-data.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {ReuploadService} from '../../services/reupload.service';
import {SpaceService} from '../../services/space.service';
import {StaticTextService} from '../../services/static-text.service';
import {LanguageService} from '../../services/language.service';
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";

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
  @ViewChild("videoPlayer", {static: false})
  videoPlayer: ElementRef;
  contentType: string
  srcIsReady: Promise<boolean>;
  text;
  editableText;
  isDisabled = true;
  originalText;
  fileUrl: string;

  constructor(private fileDataService: FileDataService,
              public reuploadService: ReuploadService,
              public spaceService: SpaceService,
              public staticTextService: StaticTextService,
              public languageService: LanguageService,
              private sanitizer: DomSanitizer) {
  }

  public onReady(editor) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

  ngOnInit() {
    this.setContent();
  }

  setContent(): void {
    this.fileDataService.fetchFile(this.file.id).subscribe(data => {
      this.contentType = this.fileDataService.getContentType();
      console.log(this.contentType);
      if (this.contentType.includes('image')) {
        this.fileUrl = data;
      } else if (this.contentType.includes('video')) {
        //TODO: progressive loading, so the user can watch the video even if its not completely loaded
        this.fileUrl = data;
      } else if (this.contentType.includes('text')) {
        this.text = data;
        this.originalText = data;
        // workaround as otherwise in the ckeditor it is undefined
        this.editableText = this.text.changingThisBreaksApplicationSecurity;
      } else {
        this.contentType = this.getFileType();
        if (this.contentType.includes('pdf')) {
          this.fileUrl = data;
        }
      }
      this.srcIsReady = Promise.resolve(true);
    });
  }

  getFileType(): string {
    const fileName = this.file.name.split('.');
    return fileName[fileName.length - 1].toLowerCase();
  }

  toggleVideo() {
    this.videoPlayer.nativeElement.play();
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

  // cancel Editing and resets text to original form
  cancel() {
    this.editableText = this.originalText.changingThisBreaksApplicationSecurity;
    this.text = this.originalText;
    this.toggleEditing();
  }

  getConvertedDate(): string {
    const date = new Date(this.file.creationDate);
    return date.toLocaleString();
  }
}
