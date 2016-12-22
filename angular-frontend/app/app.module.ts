import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'

// import { ImageUploadModule } from 'ng2-imageupload';

import { AppComponent }  from './app.component';
import { CitationFormComponent } from './citation-form.component';
import { CitationSelectorComponent } from './citation-selector.component';


@NgModule({
  imports: [ BrowserModule,
    FormsModule
    ],
  declarations: [ AppComponent, CitationFormComponent, CitationSelectorComponent],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
