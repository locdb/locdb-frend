import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LocdbService } from '../locdb.service';
import {  Response } from '@angular/http';
import { models } from '../locdb'
import { UserService } from '../typescript-angular-client/api/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Output() feeds: EventEmitter<models.Feed[]> = new EventEmitter();
  @Output() userChanged: EventEmitter<boolean> = new EventEmitter();
  currentUser: models.User = null;
  connecting = false;

  constructor ( private userService: UserService ) {}

  ngOnInit() {
  }

  // validate(user: models.User, msg: Response | any) {
  //   if (msg.ok) {
  //     console.log('Login succeeded', user, msg.json());
  //     this.currentUser = user;
  //     this.userChanged.next(true);
  //     this.feeds.emit(msg.json().feeds);
  //   } else {
  //     console.log('Message not ok');
  //     alert('Invalid credentials.');
  //     this.userChanged.next(false);
  //   }
  //   this.connecting = false;
  // }

  successHandler(user: models.User) {
    this.currentUser = user;
    this.userChanged.emit(true);
    this.feeds.emit(user.feeds || []);
  }

  fail(error: any) {
    this.connecting = false;
    this.currentUser = null;
    this.userChanged.next(false);
    alert(error.message);
  }



  onSignUp(username: string, password: string) {
    this.connecting = true;
    // todo fixme
    // this.locdbService.instance(instance).register(user, pass)
    // .then( (message) => this.validate(instance, user, message))
    // .catch((err) => this.fail(err));
    const user: models.User = { username: username, password: password };
    this.userService.signup(user).subscribe(
      (msg) => this.successHandler(user),
      (err) => this.fail(err)
    );
  }

  onSignIn(username: string, password: string) {
    this.connecting = true;
    // fancy server interaction
    // this.locdbService.instance(instance).register(user, pass)
    // .map( (message) => this.validate(instance, user, message))
    // .catch((err) => this.fail(err));
    const user: models.User = { username: username, password: password };
    this.userService.login(user).subscribe(
      (response) => this.successHandler(response),
      (error) => this.fail(error)
    );
  }

  onLogout() {
    this.userService.logout().subscribe(
      (success) => this.successHandler(null),
      (error) => this.fail(error),
    );
  }

}
