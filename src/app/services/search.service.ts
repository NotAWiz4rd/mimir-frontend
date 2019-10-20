import {Injectable} from '@angular/core';

@Injectable()
export class SearchService {
  constructor() {
  }

  getSearchablesForPath(path: string): string[] {
    // todo remove this testdata and replace with real data
    return ['type', 'blub', 'bla', 'test', 'lorem', 'ipsum', 'doles', 'doctor', 'doctorante', 'bsdfd', 'helau', 'whisky', 'whiskey'];
  }

  search(searchValue: string) {
    console.log(searchValue);
  }
}
