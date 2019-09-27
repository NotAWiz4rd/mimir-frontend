import {Component} from '@angular/core';
import {NavigationService} from './services/navigation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'se-frontend-angular';

  constructor(private navigationService: NavigationService) {
  }

  navigateToView(view: string) {
    this.navigationService.navigateToView(view);
  }
}
