import {Component, OnDestroy, OnInit} from '@angular/core';
import {map, startWith} from 'rxjs/operators';
import {Observable, Subscription} from 'rxjs';
import {FormControl} from '@angular/forms';
import {LanguageService} from '../../services/language.service';
import {SearchService} from '../../services/search.service';
import {StaticTextService} from '../../services/static-text.service';
import {NavigationService} from '../../services/navigation.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {
  searchOptions: string[] = [];
  filteredOptions: Observable<string[]>;
  control = new FormControl();
  searchValue = '';

  namePathSubscription: Subscription;

  constructor(public staticTextService: StaticTextService,
              public languageService: LanguageService,
              private searchService: SearchService,
              private navigationService: NavigationService) {
  }

  ngOnInit() {
    this.namePathSubscription = this.navigationService.namePath$.subscribe(path => {
      // don't look for searchables if we're in a file view
      if (!path.includes('.')) {
        this.searchOptions = this.searchService.getSearchablesForPath(path);
      }
    });

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

  ngOnDestroy(): void {
    if (this.namePathSubscription != undefined) {
      this.namePathSubscription.unsubscribe();
    }
  }
}
