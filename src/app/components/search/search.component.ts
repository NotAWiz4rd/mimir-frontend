import {Component, OnInit} from '@angular/core';
import {map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {FormControl} from '@angular/forms';
import {LanguageService} from '../../services/language.service';
import {SearchService} from '../../services/search.service';
import {StaticTextService} from '../../services/static-text.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchOptions: string[] = ['type', 'blub', 'hulla'];
  filteredOptions: Observable<string[]>;
  control = new FormControl();
  searchValue: string = '';

  constructor(public staticTextService: StaticTextService,
              public languageService: LanguageService,
              private searchService: SearchService) {
  }

  ngOnInit() {
    this.searchOptions = this.searchService.getSearchablesForPath('');

    this.filteredOptions = this.control.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );

    this.control.valueChanges.subscribe(result => this.searchValue = result);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.searchOptions.filter(option => option.toLowerCase().includes(filterValue)).splice(0, 5);
  }

  onEnter() {
    this.searchService.search(this.searchValue);
  }
}
