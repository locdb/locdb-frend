import { Component, OnInit, Input } from '@angular/core';
import { LocdbService } from '../locdb.service';
import {  Response } from '@angular/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Input() instances = [{name: 'UB Mannheim', url: 'https://locdb.bib.uni-mannheim.de/locdb'},
    {name: 'LOCDB Dev', url: 'https://locdb.bib.uni-mannheim.de/locdb-dev'}];
  currentUser = null;
  currentInstance = null;
  connecting = false;

  constructor ( private locdbService: LocdbService ) {}

  ngOnInit() {
  }

  validate(instance: string, user: string, msg: Response | any) {
    console.log(msg);
    if (msg.ok) {
      this.currentUser = user;
      this.currentInstance = instance;
    } else {
      console.log('Message not ok');
      alert('Invalid credentials.');
    }
    this.connecting = false;
  }



  onSignUp(instance: string, user: string, pass: string) {
    this.connecting = true;
    this.locdbService.instance(instance).signup(user, pass).subscribe(
      (message) => this.validate(instance, user, message)
    );
  }

  onSignIn(instance: string, user: string, pass: string) {
    this.connecting = true;
    // fancy server interaction
    this.locdbService.instance(instance).login(user, pass).subscribe(
      (message) => this.validate(instance, user, message)
    );
  }

  onLogout() {
    this.locdbService.logout().subscribe( (msg) => this.validate(null, null, msg) );
  }

}
