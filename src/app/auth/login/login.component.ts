import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loading: boolean = false;

  constructor(public authService: AuthService) {}

  onLogin(formLogin: NgForm) {
    if (formLogin.invalid) {
      return;
    }
    this.authService.login(formLogin.value.email, formLogin.value.password);
  }
}
