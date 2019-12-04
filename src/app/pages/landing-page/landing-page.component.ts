import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {NavigationService} from '../../services/navigation.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  value1 = false;
  value2 = false;
  value3 = false;

  constructor(private userService: UserService,
              private navigationService: NavigationService) {
  }

  ngOnInit() {
  }

  goToLogin() {
    this.navigationService.navigateToView('login');
  }
}

