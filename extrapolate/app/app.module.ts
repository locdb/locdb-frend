import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent }  from './app.component';

import { ScanComponent } from "./scan.component";
import { ReferenceComponent } from "./reference.component";

@NgModule({
  imports:      [ BrowserModule, FormsModule ],
  declarations: [ AppComponent, ScanComponent, ReferenceComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
