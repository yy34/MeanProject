import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token!: string;
  private isAuth = false;
  private authStatusListener = new Subject<boolean>();
  constructor(private http: HttpClient, private router: Router) {}

  getIsAuth() {
    return this.isAuth;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }
  signUp(email: string, password: string) {
    const userAuth: AuthData = { email: email, password: password };
    this.http
      .post('http://localhost:3000/api/user/signup', userAuth)
      .subscribe((response) => {
        console.log(response);
      });
  }
  login(email: string, password: string) {
    const userAuth: AuthData = { email: email, password: password };
    this.http
      .post<{ token: string }>('http://localhost:3000/api/user/login', userAuth)
      .subscribe((response) => {
        const token = response.token;
        this.token = token;
        if (token) {
          this.isAuth = true;
          this.authStatusListener.next(true);
          this.router.navigate(['/']);
        }
      });
  }
  getToken() {
    return this.token;
  }
}
