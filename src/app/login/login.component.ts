import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LocdbService } from '../locdb.service';
import {  Response } from '@angular/http';
import { Feed } from '../locdb'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  // @Input() instances = [{name: 'LOCDB Dev', url: 'https://locdb.bib.uni-mannheim.de/locdb-dev'},
  //   {name: 'UB Mannheim', url: 'https://locdb.bib.uni-mannheim.de/locdb'}];
  @Output() feeds: EventEmitter<Feed[]> = new EventEmitter();
  @Output() userChanged: EventEmitter<boolean> = new EventEmitter();
  currentUser = null;
  connecting = false;

  constructor ( private locdbService: LocdbService ) {}

  ngOnInit() {
  }

  validate(user: string, msg: Response | any) {
    if (msg.ok) {
      console.log('Login succeeded', user, msg.json());
      this.currentUser = user;
      this.userChanged.next(true);
      this.feeds.emit(msg.json().feeds);
    } else {
      console.log('Message not ok');
      alert('Invalid credentials.');
      this.userChanged.next(false);
    }
    this.connecting = false;
  }

  fail(err: any) {
    this.connecting = false;
    this.currentUser = null;
    this.userChanged.next(false);
  }



  onSignUp(user: string, pass: string) {
    this.connecting = true;
    // todo fixme
    // this.locdbService.instance(instance).register(user, pass)
    // .then( (message) => this.validate(instance, user, message))
    // .catch((err) => this.fail(err));
    this.locdbService.register(user, pass).subscribe(
      (msg) => this.validate(user, msg),
        (err) => this.fail(err)
    );
  }

  onSignIn(user: string, pass: string) {
    this.connecting = true;
    // fancy server interaction
    // this.locdbService.instance(instance).register(user, pass)
    // .map( (message) => this.validate(instance, user, message))
    // .catch((err) => this.fail(err));
    this.locdbService.login(user, pass).subscribe(
      (message) => this.validate(user, message),
      (error) => this.fail(error)
    );
  }

  onLogout() {
    this.locdbService.logout().subscribe(
      // brute logout
      (msg) => this.fail(msg),
      (err) => this.fail(err),
    );
      // .catch((err) => this.fail);
  }

}
