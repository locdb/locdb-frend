import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';

// import { ImageUploadModule } from 'ng2-imageupload';
// exported to uploader

// ng2-bootstrap
import { ModalModule } from 'ngx-bootstrap/modal';
// ng2-fileupload
// import { FileSelectDirective } from 'ng2-file-upload';

import { AppComponent } from './app.component';
import { CitationFormComponent } from './citation-form.component';
import { ScanComponent } from './scan.component';
import { TodoComponent } from './todo.component';
import { DisplayComponent } from './display/display.component';
import { EntryFormComponent } from './entry-form/entry-form.component';
import { LocdbService } from './locdb.service';
import { SuggestionComponent } from './suggestion/suggestion.component';
import { ResourceFormComponent } from './resource-form/resource-form.component';


import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { PopoverModule } from 'ngx-popover';

import * as d3 from 'd3';
import { LoginComponent } from './login/login.component';
import { VisualComponent } from './visual/visual.component';

@NgModule({
  imports: [
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    CollapseModule.forRoot(),
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    PopoverModule
    ],
  declarations: [
    AppComponent,
    CitationFormComponent,
    ScanComponent,
    TodoComponent,
    DisplayComponent,
    EntryFormComponent,
    SuggestionComponent,
    ResourceFormComponent,
    LoginComponent,
    VisualComponent,
    // LocdbService
  ],
  providers: [ LocdbService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
