import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-space-bubble',
  templateUrl: './space-bubble.component.html',
  styleUrls: ['./space-bubble.component.css']
})
export class SpaceBubbleComponent implements OnInit {

  @Input()
  spacename: string = '';

  @Input()
  thumbnailId: number;

  constructor() {
  }

  ngOnInit() {
    // todo get thumbnail
  }

}
