import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  loading: boolean = false;

  constructor(public authService: AuthService) {}

  onSignup(formSign: NgForm) {
    if (formSign.invalid) {
      return;
    }
    this.authService.signUp(formSign.value.email, formSign.value.password);
  }
}
