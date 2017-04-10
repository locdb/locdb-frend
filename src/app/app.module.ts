import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';

// import { ImageUploadModule } from 'ng2-imageupload';
// exported to uploader

// ng2-bootstrap
import { ModalModule } from 'ng2-bootstrap/modal';
//ng2-fileupload
import { FileSelectDirective } from 'ng2-file-upload';

import { AppComponent } from './app.component';
import { CitationFormComponent } from './citation-form.component';
import { ScanComponent } from './scan.component';
import { TodoComponent } from './todo.component';
import { DisplayComponent } from './display/display.component';
// import { EntryFormComponent } from './entry-form/entry-form.component';
// import { LocdbService } from './locdb.service';

@NgModule({
  imports: [
    ModalModule.forRoot(),
    BrowserModule,
    FormsModule,
    HttpModule
    ],
  declarations: [
    AppComponent,
    CitationFormComponent,
    ScanComponent,
    TodoComponent,
    FileSelectDirective,
    DisplayComponent
    // LocdbService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
