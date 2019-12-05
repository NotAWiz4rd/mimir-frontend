import {Injectable} from '@angular/core';

@Injectable()
export class LanguageService {
  constructor() {
  }

  getLanguage(): number {
    const language = localStorage.getItem('language') != null ? localStorage.getItem('language') : 0;
    return Number(language);
  }

  getLanguageString(): string {
    const language = this.getLanguage();
    switch (language) {
      case 0:
        return 'English';
      case 1:
        return 'German';
      default:
        return 'English';
    }
  }

  setLanguage(language: number) {
    localStorage.setItem('language', String(language));
  }

  setLanguageString(language: string = '') {
    switch (language.toLowerCase()) {
      case 'english':
        this.setLanguage(0);
        break;
      case 'german':
        this.setLanguage(1);
        break;
    }
  }

}
