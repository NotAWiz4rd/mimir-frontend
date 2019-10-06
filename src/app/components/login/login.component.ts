import {Component, OnInit} from '@angular/core';
import {LoginService} from '../../services/login.service';
import {User} from '../../classes/User';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private loginService: LoginService) {
  }

  ngOnInit() {
    let user = new User();
    user.username = 'test';
    user.password = 'test';

    this.loginService.login(user).subscribe(result => {
      console.log(result);
    });
  }

}
