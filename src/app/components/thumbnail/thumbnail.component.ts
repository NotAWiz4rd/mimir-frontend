import {Component, Input, OnInit} from '@angular/core';
import {ThumbnailService} from '../../services/thumbnail.service';

@Component({
  selector: 'app-thumbnail',
  templateUrl: './thumbnail.component.html',
  styleUrls: ['./thumbnail.component.css']
})
export class ThumbnailComponent implements OnInit {
  @Input()
  filename: string;

  @Input()
  thumbnailId: number;

  thumbnailImage: any;

  constructor(private thumbnailService: ThumbnailService) {
  }

  ngOnInit() {
    this.thumbnailService.loadThumbnail(this.thumbnailId).subscribe(data => {
      this.thumbnailImage = this.thumbnailService.createImageFromBlob(data);
    });
  }
}
