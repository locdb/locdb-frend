import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
// import { RouterModule } from '@angular/router';

// import { ImageUploadModule } from 'ng2-imageupload';

import { AppComponent }  from './app.component';
import { CitationFormComponent } from './citation-form.component';
import { ScanComponent } from './scan.component';


@NgModule({
  imports: [ BrowserModule,
    FormsModule
    ],
  declarations: [ AppComponent, CitationFormComponent, ScanComponent ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
