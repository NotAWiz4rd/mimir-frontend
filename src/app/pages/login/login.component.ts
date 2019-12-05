import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {StaticTextService} from '../../services/static-text.service';
import {LanguageService} from '../../services/language.service';
import {NavigationService} from '../../services/navigation.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private userService: UserService,
              public staticTextService: StaticTextService,
              public languageService: LanguageService,
              private navigationService: NavigationService) {
  }

  ngOnInit() {
  }

  login() {
    this.userService.login('thellmann', 'thellmann');
    this.navigationService.navigateToSpace(2); // todo get user from backend, navigate to first space
  }

  register() {
    this.userService.register('test', 'test', 'test');
  }
}
