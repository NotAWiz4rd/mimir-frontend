import {Injectable} from "@angular/core";

@Injectable()
export class LanguageService {
  constructor() {
  }

  getLanguage(): number {
    let language = localStorage.getItem('language') != null ? localStorage.getItem('language') : 0;
    return Number(language);
  }

  changeLanguage(language: number) {
    localStorage.setItem('language', String(language))
  }
}
