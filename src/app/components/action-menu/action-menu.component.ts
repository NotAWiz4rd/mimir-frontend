import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {StaticTextService} from '../../services/static-text.service';
import {LanguageService} from '../../services/language.service';

@Component({
  selector: 'app-action-menu',
  templateUrl: './action-menu.component.html',
  styleUrls: ['./action-menu.component.css']
})
export class ActionMenuComponent implements OnInit {
  @Output()
  actionEmitter: EventEmitter<string> = new EventEmitter();

  constructor(public staticTextService: StaticTextService,
              public languageService: LanguageService) {
  }

  ngOnInit() {
  }

  stopPropagation($event: MouseEvent) {
    $event.stopPropagation();
  }

  rename() {
    this.actionEmitter.emit('rename');
  }

  download() {
    this.actionEmitter.emit('download');
  }

  delete() {
    this.actionEmitter.emit('delete');
  }

  share() {
    this.actionEmitter.emit('share');
  }
}
