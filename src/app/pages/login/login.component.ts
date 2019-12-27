import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {StaticTextService} from '../../services/static-text.service';
import {LanguageService} from '../../services/language.service';
import {NavigationService} from '../../services/navigation.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SpaceService} from '../../services/space.service';

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
              private navigationService: NavigationService,
              private spaceService: SpaceService) {
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    if (this.userService.token) {
      this.tryToLoadUser();
    }
  }

  async tryToLoadUser() {
    await this.userService.reloadUser();
    if (this.userService.currentUser$.getValue() != undefined && this.userService.currentUser$.getValue().spaces != undefined
      && this.userService.currentUser$.getValue().spaces.length > 0) {
      this.navigationService.navigateToSpace(this.userService.currentUser$.getValue().spaces[0].id);
    }
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  async login() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    //TODO change to: await this.userService.login(this.f.username.value, this.f.password.value)
    await this.userService.login('thellmann', 'thellmann'); // todo get user from backend
    //TODO if error -> this.loading = false  and  display error message
    if (this.userService.currentUser$.getValue().spaces.length > 0) {
      this.navigationService.navigateToSpace(this.userService.currentUser$.getValue().spaces[0].id);
    } else {
      this.spaceService.createSpace(this.userService.currentUser$.getValue().name).subscribe(spaceMetaData => {
        this.userService.addSpaceToUser(spaceMetaData);
        this.navigationService.navigateToSpace(spaceMetaData.id);
      });
    }
  }

  register() {
    this.userService.register('test', 'test', 'test');
  }
}
