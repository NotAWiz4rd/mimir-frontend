import {Component, OnInit} from '@angular/core';
import {StaticText} from './classes/StaticText';
import {HttpClient} from '@angular/common/http';
import {Globals} from './util/Globals';

const TEXTFILE_PATH = '../../../assets/texts.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(public globals: Globals,
              private http: HttpClient) {
  }

  ngOnInit(): void {
    this.loadTexts();
  }

  loadTexts() {
    // load file with static texts
    this.http.get(TEXTFILE_PATH)
      .subscribe(data => {
        this.globals.staticTexts = data as StaticText[];
        console.log('Loaded static texts.');
      });
  }
}
