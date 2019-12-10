import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { ThumbnailService } from 'src/app/services/thumbnail.service';

@Component({
  selector: 'app-thumbnail',
  templateUrl: './thumbnail.component.html',
  styleUrls: ['./thumbnail.component.css']
})
export class ThumbnailComponent implements OnInit {
  @Input()
  fileName: string;

  @Input()
  fileId: number;

  @Input()
  thumbnailType: string;

  @Output()
  actionEmitter: EventEmitter<string> = new EventEmitter<string>();

  thumbnailUrl: string = 'assets/thumbnails/folder.png';

  constructor(private thumbnailService: ThumbnailService) {
  }

  ngOnInit() {
    if(this.thumbnailType == 'file') this.setFileThumbnailUrl();
  }

  emitAction(action: string) {
    this.actionEmitter.emit(action);
  }

  getShortenedFileName(): string {
    return this.fileName.length > 15 ? this.fileName.substr(0, 12) + '...' : this.fileName;
  }

  setFileThumbnailUrl(): void {
    this.thumbnailService.fetchThumbnail(this.fileId).subscribe(base64Image => {
      this.thumbnailUrl = base64Image;
    });
  }
}
