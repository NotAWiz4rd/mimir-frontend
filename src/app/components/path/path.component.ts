import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {NavigationService} from '../../services/navigation.service';
import {SpaceService} from '../../services/space.service';

@Component({
  selector: 'app-path',
  templateUrl: './path.component.html',
  styleUrls: ['./path.component.css']
})
export class PathComponent implements OnInit, OnChanges {
  @Input()
  path: string;

  pathElements: string[];

  constructor(private navigationService: NavigationService,
              private spaceService: SpaceService) {
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
    let folderGoal = this.spaceService.convertPathToFolder(pathWithinSpace.slice(0, pathWithinSpace.length - 1));
    this.navigationService.navigateWithinSpace(folderGoal);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.pathElements = this.path.split('/');
  }
}
