import {Component, Input, OnInit} from '@angular/core';
import {File} from '../../classes/File';

@Component({
  selector: 'app-file-view',
  templateUrl: './file-view.component.html',
  styleUrls: ['./file-view.component.css']
})
export class FileViewComponent implements OnInit {
  @Input()
  file: File;

  constructor() {
  }

  ngOnInit() {
  }

}
