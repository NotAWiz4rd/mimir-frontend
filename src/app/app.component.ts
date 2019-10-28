import {Component, OnInit} from '@angular/core';
import {StaticTextService} from './services/static-text.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(public staticTextService: StaticTextService) {
  }

  ngOnInit(): void {
    this.staticTextService.loadStaticTexts();
  }
}
