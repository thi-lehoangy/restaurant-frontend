import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../_services/auth.service';
import { VerifyService } from '../_services/verify.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {

  constructor(
    private as: AuthService,
    private vs: VerifyService,
    private _router: Router,
    private cookieService: CookieService
  ) { }

  ngOnInit(): void {
  }

  needLogIn() {
    if (this._router.url == '/signup') {
      return true;
    } else {
      return false;
    }
  }

  usernameErr = { notification: "Please enter username", result: true };
  passwordErr = { notification: "Please enter password", result: true };

  isActive: boolean = false;

  changeType() {
    this.isActive = !this.isActive;
  }

  async signup(username: string, password: string, event?: any) {
    event.preventDefault();
    let verifyUsername;
    let verifyPassword;
    this.usernameErr = { notification: "Please enter username", result: true };
    this.passwordErr = { notification: "Please enter password", result: true };

    verifyUsername = this.vs.verifyUsername(username);
    if (verifyUsername != 'Username is valid') {
      this.usernameErr = { notification: verifyUsername, result: false };
    } 
    
    else {
      verifyPassword = this.vs.verifyPassword(password);
      if (verifyPassword != 'Password is valid') {
        this.passwordErr = { notification: verifyPassword, result: false };
      } 
      
      else {
        let user = { username: username, password: password }
        const responseFromServer = await this.as.signup(user);
        if ( Object.values(responseFromServer)[0] == '006') {
          this.usernameErr = { notification: Object.values(responseFromServer)[1], result: false };
        } else {
          this._router.navigate(['/login']);
        }
      }
    }
  }

  async login(username: string, password: string, event?: any) {
    event.preventDefault();
    let verifyUsername;
    let verifyPassword;
    this.usernameErr = { notification: "Please enter username", result: true };
    this.passwordErr = { notification: "Please enter password", result: true };

    verifyUsername = this.vs.verifyUsername(username);
    if (verifyUsername != 'Username is valid') {
      this.usernameErr = { notification: verifyUsername, result: false };
    } 
    
    else {
      verifyPassword = this.vs.verifyPassword(password);
      if (verifyPassword != 'Password is valid') {
        this.passwordErr = { notification: verifyPassword, result: false };
      } 
      
      else {
        let user = { username: username, password: password }
        let responseFromServer = await this.as.login(user);
        
        if ( Object.values(responseFromServer)[0] == '021' ) {
          this.usernameErr = { notification: Object.values(responseFromServer)[1], result: false };
        } else if ( Object.values(responseFromServer)[0] == '022' ) {
          this.passwordErr = { notification: Object.values(responseFromServer)[1], result: false };
        } else if ( Object.values(responseFromServer)[0] == '020' ) {
          this.cookieService.set('jwt', Object.values(responseFromServer)[1], (1/24/60) * 20);
          // localStorage.setItem("idToken", Object.values(responseFromServer)[1]);
          this._router.navigate(['/menu']);
        }
      }
    }
  }
}
