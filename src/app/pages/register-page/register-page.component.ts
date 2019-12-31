import {Component, OnInit} from '@angular/core';
import {LanguageService} from '../../services/language.service';
import {StaticTextService} from '../../services/static-text.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit {
  loginForm: FormGroup;
  sentMail: boolean = false;
  error: boolean = false;

  constructor(public languageService: LanguageService,
              public staticTextService: StaticTextService,
              private formBuilder: FormBuilder,
              private userService: UserService) {
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      mail: ['', Validators.email]
    });
  }

  async register() {
    this.sentMail = false;
    if (!this.loginForm.valid) {
      return;
    }
    this.error = false;
    await this.userService.register(this.loginForm.controls.mail.value).catch(() => this.error = true);
    this.sentMail = true;
  }
}
