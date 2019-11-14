import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UserService} from '../../services/user.service';
import {SpaceMetadata} from '../../classes/SpaceMetadata';
import {NavigationService} from '../../services/navigation.service';

@Component({
  selector: 'app-space-bar',
  templateUrl: './space-bar.component.html',
  styleUrls: ['./space-bar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SpaceBarComponent implements OnInit {
  spaces: SpaceMetadata[] = [];

  constructor(private userService: UserService,
              private navigationService: NavigationService) {
  }

  ngOnInit() {
    this.userService.currentUser$.subscribe(user => {
      this.spaces = user.spaces;
    });
  }

  navigateToSpace(id: number) {
    this.navigationService.navigateToSpace(id);
  }
}
