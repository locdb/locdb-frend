/* tslint:disable:no-unused-variable */
import { AppComponent } from './app.component';

import { TestBed } from '@angular/core/testing';

import { By } from '@angular/platform-browser';

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
import { CitationFormComponent } from './citation-form.component';
import { ScanComponent } from './scan.component';
import { TodoComponent } from './todo.component';
import { DisplayComponent } from './display/display.component';
import { EntryFormComponent } from './entry-form/entry-form.component';
import { LocdbService } from './locdb.service';
import { SuggestionComponent } from './suggestion/suggestion.component';
import { ResourceFormComponent } from './resource-form/resource-form.component';
import { VisualComponent } from './visual/visual.component';
import { LoginComponent } from './login/login.component';
import { CommitComponent} from './commit/commit.component';
import { PopoverModule } from 'ngx-popover';

import { CredentialsService } from 'angular-with-credentials';

////////  SPECS  /////////////

/// Delete this
describe('Smoke test', () => {
  it('should run a passing test', () => {
    expect(true).toEqual(true, 'should pass');
  });
});

describe('AppComponent with TCB', function () {
  beforeEach(() => {
    TestBed.configureTestingModule(
      {
        providers: [ LocdbService, CredentialsService ],
        declarations: [
          AppComponent,
          CitationFormComponent,
          DisplayComponent,
          TodoComponent,
          SuggestionComponent,
          EntryFormComponent,
          ScanComponent,
          ResourceFormComponent,
          VisualComponent,
          LoginComponent,
          CommitComponent
        ],
        imports: [ModalModule.forRoot(), BrowserModule, FormsModule, HttpModule, ReactiveFormsModule, PopoverModule]});
  });

  it('should instantiate component', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance instanceof AppComponent).toBe(true, 'should create AppComponent');
  });

  it('should have expected <h1> text', () => {
    let fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    let h1 = fixture.debugElement.query(el => el.name === 'h1').nativeElement;  // it works

    h1 = fixture.debugElement.query(By.css('h1')).nativeElement;            // preferred

    expect(h1.innerText).toMatch(/extrapolite/i, '<h1> should say something about "Extrapolite"');
  });
});
