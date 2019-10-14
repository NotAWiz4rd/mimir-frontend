import {Pipe, PipeTransform} from '@angular/core';
import {Language} from '../classes/Language';
import {StaticText} from '../classes/StaticText';

@Pipe({
  name: 'getStaticText'
})
export class GetStaticTextPipe implements PipeTransform {
  transform(texts: StaticText[], key: string, language: Language): string {
    if (!texts || !key) {
      return '';
    }

    let staticText = key;

    texts.forEach(text => {
      if (text.logicalName === key) {
        switch (String(language)) {
          case '0':
            staticText = text.english;
            break;
          case '1':
            staticText = text.german;
            break;
          default:
            staticText = text.english;
            break;
        }
      }
    });
    return staticText;
  }
}
