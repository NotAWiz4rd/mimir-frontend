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
  loading: boolean = false;
  submitted: boolean = false;

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

  async login() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    await this.userService.login(this.loginForm.controls.username.value, this.loginForm.controls.password.value)
      .finally(() => this.loading = false);
    if (this.userService.currentUser$.getValue() != undefined) {
      this.setProperSpace();
    }
  }

  private setProperSpace() {
    if (this.userService.currentUser$.getValue().spaces.length > 0) {
      this.navigationService.navigateToSpace(this.userService.currentUser$.getValue().spaces[0].id);
    } else { // create new space if user has none
      this.spaceService.createSpace(this.userService.currentUser$.getValue().name).subscribe(spaceMetaData => {
        this.userService.addSpaceToUser(spaceMetaData);
        this.navigationService.navigateToSpace(spaceMetaData.id);
      });
    }
  }
}
