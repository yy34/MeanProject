import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
@Injectable({ providedIn: 'root' })
export class AuthService {
  private token: any;
  private isAuth = false;
  private timerToken: any;
  private authStatusListener = new Subject<boolean>();
  private userId: any;

  constructor(private http: HttpClient, private router: Router) {}
  getIsAuth() {
    return this.isAuth;
  }
  getUserId() {
    return this.userId;
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
      .post<{ token: string; expiresIn: number; userId: string }>(
        'http://localhost:3000/api/user/login',
        userAuth
      )
      .subscribe((response) => {
        const token = response.token;
        this.token = token;
        if (token) {
          this.setAuthTimer(response.expiresIn);
          this.isAuth = true;
          this.userId = response.userId;
          this.authStatusListener.next(true);
          const dateNow = new Date();
          const endDate = new Date(
            dateNow.getTime() + response.expiresIn * 1000
          );
          this.setStorage(token, endDate, this.userId);
          this.router.navigate(['/']);
        }
      });
  }
  setAuthUser() {
    const userAuthInfo = this.getStorage();
    if (userAuthInfo) {
      const dateNow = new Date();
      const expiry = userAuthInfo.endTime.getTime() - dateNow.getTime();
      if (expiry > 0) {
        this.token = userAuthInfo.token;
        this.isAuth = true;
        this.userId = userAuthInfo.userId;
        this.setAuthTimer(expiry / 1000);
        this.authStatusListener.next(true);
      }
    } else {
      return;
    }
  }
  logout() {
    this.token = null;
    this.isAuth = false;
    this.authStatusListener.next(false);
    this.userId = null;
    clearTimeout(this.timerToken);
    this.clearStorage();
    this.router.navigate(['/']);
  }
  private setAuthTimer(time: number) {
    this.timerToken = setTimeout(() => {
      this.logout();
    }, time * 1000);
  }
  private setStorage(token: string, endDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('endtime', endDate.toISOString());
    localStorage.setItem('userId', userId);
  }
  private clearStorage() {
    localStorage.removeItem('token');
    localStorage.removeItem('endtime');
    localStorage.removeItem('userId');
  }
  private getStorage() {
    const token = localStorage.getItem('token');
    const endTime = localStorage.getItem('endtime');
    const userId = localStorage.getItem('userId');

    if (token && endTime) {
      return {
        token: token,
        endTime: new Date(endTime),
        userId: userId,
      };
    } else {
      return;
    }
  }
  getToken() {
    return this.token;
  }
}
