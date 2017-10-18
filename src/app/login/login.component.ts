import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LocdbService } from '../locdb.service';
import {  Response } from '@angular/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Input() instances = [{name: 'LOCDB Dev', url: 'https://locdb.bib.uni-mannheim.de/locdb-dev'},
    {name: 'UB Mannheim', url: 'https://locdb.bib.uni-mannheim.de/locdb'}];

  @Output() userChanged: EventEmitter<boolean> = new EventEmitter();
  currentUser = null;
  currentInstance = null;
  connecting = false;

  constructor ( private locdbService: LocdbService ) {}

  ngOnInit() {
  }

  validate(instance: string, user: string, msg: Response | any) {
    // console.log(msg);
    if (msg.ok) {
      console.log(instance, user, msg);
      this.currentUser = user;
      this.currentInstance = instance;
      this.userChanged.next(true);
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
    this.currentInstance = null;
    this.userChanged.next(false);
  }



  onSignUp(instance: string, user: string, pass: string) {
    this.connecting = true;
    // todo fixme
    // this.locdbService.instance(instance).register(user, pass)
    // .then( (message) => this.validate(instance, user, message))
    // .catch((err) => this.fail(err));
    this.locdbService.instance(instance).register(user, pass).subscribe(
      (msg) => this.validate(instance, user, msg),
        (err) => this.fail(err)
    );
  }

  onSignIn(instance: string, user: string, pass: string) {
    this.connecting = true;
    // fancy server interaction
    // this.locdbService.instance(instance).register(user, pass)
    // .map( (message) => this.validate(instance, user, message))
    // .catch((err) => this.fail(err));
    this.locdbService.instance(instance).login(user, pass).subscribe(
      (message) => this.validate(instance, user, message),
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
