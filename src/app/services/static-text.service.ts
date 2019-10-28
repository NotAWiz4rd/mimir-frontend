import {Injectable} from '@angular/core';
import {StaticText} from '../classes/StaticText';
import {HttpClient} from '@angular/common/http';

const TEXTFILE_PATH = '../../../assets/texts.json';

@Injectable()
export class StaticTextService {
  staticTexts: StaticText[] = [];

  constructor(private http: HttpClient) {
  }

  loadStaticTexts() {
    this.http.get(TEXTFILE_PATH)
      .subscribe(data => {
        this.staticTexts = data as StaticText[];
        console.log('Loaded static texts.');
      });
  }
}
