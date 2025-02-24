import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {LanguageService} from '../../services/language.service';
import {StaticTextService} from '../../services/static-text.service';
import {UserService} from '../../services/user.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NavigationService} from '../../services/navigation.service';

@Component({
  selector: 'app-confirm-page',
  templateUrl: './confirm-page.component.html',
  styleUrls: ['./confirm-page.component.css']
})
export class ConfirmPageComponent implements OnInit {
  mail: string = '';
  token: string = '';

  loginForm: FormGroup;
  error: boolean = false;

  constructor(private route: ActivatedRoute,
              public languageService: LanguageService,
              public staticTextService: StaticTextService,
              private formBuilder: FormBuilder,
              private userService: UserService,
              private navigationService: NavigationService) {
    this.route.params.subscribe(params => {
      if (params['mail'] != undefined) {
        this.mail = params['mail'];
      }

      if (params['token'] != undefined) {
        this.token = params['token'];
      }
    });
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      password: ['', Validators.required]
    });
  }

  async finishRegistration() {
    if (this.loginForm.controls.password.valid) {
      await this.userService.finishRegistration(this.loginForm.controls.password.value, this.token)
        .catch(() => this.error = true)
        .then(() => {
          if (!this.error) {
            this.navigationService.navigateToView('login');
          }
        });
    }
  }

}
