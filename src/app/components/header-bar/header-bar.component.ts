import { Component, OnInit } from '@angular/core';
import {Globals} from '../../util/Globals';
import {LanguageService} from '../../services/language.service';
import {HttpClient} from '@angular/common/http';
import {NavigationService} from '../../services/navigation.service';

@Component({
  selector: 'app-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.css']
})
export class HeaderBarComponent implements OnInit {

  constructor(public globals: Globals,
              public languageService: LanguageService,
              private http: HttpClient,
              private navigationService: NavigationService) { }

  ngOnInit() {
  }

  navigateToView(view: string) {
    this.navigationService.navigateToView(view);
  }
}
