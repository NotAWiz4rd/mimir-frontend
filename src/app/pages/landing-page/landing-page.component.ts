import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {NavigationService} from '../../services/navigation.service';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  value1 = false;
  value2 = false;
  value3 = false;
  scrollTo: string;
  constructor(private userService: UserService,
              private navigationService: NavigationService) {
  }

  ngOnInit() {
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewChecked() {
    if (document.getElementById(this.scrollTo) !== null) {
      document.getElementById(this.scrollTo).scrollIntoView({behavior: 'smooth'});
      this.scrollTo = null;
    }
  }

  goToLogin() {
    this.navigationService.navigateToView('login');
  }

  scroll(id) {
    this.scrollTo = id;
  }

}
