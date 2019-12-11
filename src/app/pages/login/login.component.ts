import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {StaticTextService} from '../../services/static-text.service';
import {LanguageService} from '../../services/language.service';
import {NavigationService} from '../../services/navigation.service';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  error: string | null;

  constructor(private userService: UserService,
              private formBuilder: FormBuilder,
              public staticTextService: StaticTextService,
              public languageService: LanguageService,
              private navigationService: NavigationService) {
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  async login() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    //TODO change to: await this.userService.login(this.f.username.value, this.f.password.value)
    await this.userService.login('thellmann', 'thellmann');
    //TODO if error -> this.loading = false  and  display error message
    this.navigationService.navigateToSpace(2); // todo get user from backend, navigate to first space
  }

  register() {
    this.userService.register('test', 'test', 'test');
  }
}
