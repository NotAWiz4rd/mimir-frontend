import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {NavigationService} from '../../services/navigation.service';
import {FolderService} from '../../services/folder.service';

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
              private folderService: FolderService) {
  }

  ngOnInit() {
    this.pathElements = this.path.split('/');
  }

  navigateToElement(index: number) {
    if (index == this.pathElements.length - 1) {
      // someone clicked onto the last element, ignore it cause that's where we're (hopefully) already are
      return;
    }

    let pathWithinSpace = '';
    for (let i = 0; i <= index; i++) {
      pathWithinSpace += this.pathElements[i];
      pathWithinSpace += '/';
    }
    const folderGoal = this.folderService.convertPathToFolder(pathWithinSpace.slice(0, pathWithinSpace.length - 1));
    this.navigationService.navigateWithinSpace(folderGoal.id);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.pathElements = this.path.split('/');
  }
}
