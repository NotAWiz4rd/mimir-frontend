import {Component, OnInit} from '@angular/core';
import {NavigationService} from './services/navigation.service';
import {StaticText} from './classes/StaticText';
import {HttpClient} from '@angular/common/http';
import {Globals} from './util/Globals';
import {LanguageService} from './services/language.service';

const TEXTFILE_PATH = '../../../assets/texts.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'mimir-frontend';

  constructor(public globals: Globals,
              public languageService: LanguageService,
              private http: HttpClient,
              private navigationService: NavigationService) {
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

  navigateToView(view: string) {
    this.navigationService.navigateToView(view);
  }
}
