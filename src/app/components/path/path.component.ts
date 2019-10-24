import {Component, Input, OnInit} from '@angular/core';
import {NavigationService} from '../../services/navigation.service';

@Component({
  selector: 'app-path',
  templateUrl: './path.component.html',
  styleUrls: ['./path.component.css']
})
export class PathComponent implements OnInit {
  @Input()
  path: string;

  pathElements: string[];

  constructor(private navigationService: NavigationService) {
  }

  ngOnInit() {
    this.pathElements = this.path.split('/');
  }

  navigateToElement(index: number) {
    let pathWithinSpace = '';
    for (let i = 0; i <= index; i++) {
      pathWithinSpace += this.pathElements[i];
      pathWithinSpace += '/';
    }
    this.navigationService.navigateWithinSpace(pathWithinSpace);
  }
}
