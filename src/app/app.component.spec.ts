/* tslint:disable:no-unused-variable */
import { AppComponent } from './app.component';

import { TestBed } from '@angular/core/testing';

import { By } from '@angular/platform-browser';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
import { APP_BASE_HREF } from '@angular/common';


// import { ImageUploadModule } from 'ng2-imageupload';
// exported to uploader


// ng2-bootstrap
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TypeaheadModule } from 'ngx-bootstrap';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

// misc
import { PopoverModule } from 'ngx-popover';
import { CredentialsService } from './locdb.service';
import {HotkeyModule} from 'angular2-hotkeys';
// own
import { ScanComponent } from './ingest/scan.component';
import { TodoComponent } from './agenda/todo.component';
import { DisplayComponent } from './inspectors/display/display.component';
import { EntryFormComponent } from './inspectors/entry-form/entry-form.component';
import { LocdbService } from './locdb.service';
import { SuggestionComponent } from './suggestion/suggestion.component';
import { LoginComponent } from './login/login.component';
import { VisualComponent } from './visual/visual.component';
import { CommitComponent } from './commit/commit.component';
import { FeedComponent, FeedReaderComponent } from './ingest/feed-reader/feed-reader.component';
import { EntryListComponent } from './inspectors/entry-list/entry-list.component';
// import { TodoDetailComponent } from './todo-detail/todo-detail.component';
// import { TodoListComponent } from './todo-list/todo-list.component';
// import { TodoLeafComponent } from './todo-leaf/todo-leaf.component';
import { EmbodimentComponent } from './agenda/embodiment.component'
import { MetadataComponent } from './metadata/metadata.component'
import { AgendaComponent } from './agenda/agenda.component'
// inspector related

import { RouterRefsInspectorComponent, RouterScanInspectorComponent } from './inspectors';
import { ResourcePairFormComponent } from './resource-form/resource-pair-form.component';
// pipes
import {
    TypedResourceView,
    Metadata
} from './locdb';
import { Component, Input } from '@angular/core';

import { AuthorsPipe, EditorsPipe, PublisherPipe, EmbracePipe, ContainerPipe, PrefixPipe} from './pipes';
import { StandardPipe } from './pipes/type-pipes';
// resource related
// import { ResourceComponent } from './resource/resource.component';
import { ResourceCardComponent } from './resource-card/resource-card.component';
import { ResourceFormComponent } from './resource-form/resource-form.component';
import { FrontpageComponent } from './frontpage/frontpage.component';
import { LinkingComponent } from './linking/linking.component'
// New
import { LoggingService } from './logging.service';
import { EntryCardComponent } from './inspectors/entry-card/entry-card.component'
import { BrowseComponent } from './browse/browse.component'
// api
import { ScanService } from './typescript-angular-client/api/scan.service'
import { UserService } from './typescript-angular-client/api/user.service'
import { UtilsService } from './typescript-angular-client/api/utils.service'
import { BibliographicEntryService } from './typescript-angular-client/api/bibliographicEntry.service'
import { BibliographicResourceService } from './typescript-angular-client/api/bibliographicResource.service'

import { EditViewComponent } from './edit-view/edit-view.component'

import { HttpClient, HttpHeaders, HttpParams,
         HttpResponse, HttpEvent, HttpClientModule } from '@angular/common/http';
import { PaginationModule } from 'ngx-bootstrap';

import { PdfViewerModule } from 'ng2-pdf-viewer';
import { QuestionControlService } from './resource-form/dynamic-question-form/question-control.service';
import { QuestionService } from './resource-form/dynamic-question-form/question.service';
import { DynamicFormQuestionComponent } from './resource-form/dynamic-question-form/dynamic-form-question.component';

////////  SPECS  /////////////

const appRoutes: Routes = [
  // { path: 'resolve/:NOT_OCR_PROCESSED/:OCR_PROCESSING/:OCR_PROCESSED/:EXTERNAL', component: LinkingComponent },
  { path: 'resolve', component: LinkingComponent },
  { path: 'ingest', component: ScanComponent},
  { path: 'browse', component: BrowseComponent},
  { path: 'frontpage', component: FrontpageComponent},
  { path: 'linking/RefsInspector/:id', component: RouterRefsInspectorComponent},
  { path: 'linking/ScanInspector/:resid/:scanid', component: RouterScanInspectorComponent},
  { path: 'edit', component: EditViewComponent},
  // { path: 'feedreader', component: FeedReaderComponent},
  // { path: 'hero/:id',      component: HeroDetailComponent },
  // {
  //   path: 'heroes',
  //   component: HeroListComponent,
  //   data: { title: 'Heroes List' }
  // },

  { path: '',
    redirectTo: '/frontpage',
    pathMatch: 'full'
   },
  { path: '**', redirectTo: '/frontpage' }
];

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
        providers: [
          LocdbService,
          CredentialsService,
          LoggingService,
          ScanService,
          UserService,
          UtilsService,
          BibliographicResourceService,
          BibliographicEntryService,
          QuestionService,
          QuestionControlService,
          {provide: APP_BASE_HREF, useValue : '/'}
        ],
        declarations: [
          AppComponent,
          ScanComponent,
          TodoComponent,
          DisplayComponent,
          EntryFormComponent,
          SuggestionComponent,
          ResourceFormComponent,
          LoginComponent,
          VisualComponent,
          CommitComponent,
          FeedReaderComponent,
          FeedComponent,
          EntryListComponent,
          RouterRefsInspectorComponent,
          RouterScanInspectorComponent,
          EmbodimentComponent,
          MetadataComponent,
          AuthorsPipe,
          EditorsPipe,
          PublisherPipe,
          EmbracePipe,
          StandardPipe,
          ContainerPipe,
          PrefixPipe,
          AgendaComponent,
          LinkingComponent,
          FrontpageComponent,
          ResourceCardComponent,
          EntryCardComponent,
          BrowseComponent,
          ResourcePairFormComponent,
          EditViewComponent,
          DynamicFormQuestionComponent,
        ],
        imports: [
          PaginationModule.forRoot(),
          TypeaheadModule.forRoot(),
          AccordionModule.forRoot(),
          BsDropdownModule.forRoot(),
          ModalModule.forRoot(),
          CollapseModule.forRoot(),
          HotkeyModule.forRoot(),
          ButtonsModule.forRoot(),
          BrowserModule,
          FormsModule,
          HttpModule,
          ReactiveFormsModule,
          PopoverModule,
          PdfViewerModule,
          HttpClientModule,
          RouterModule.forRoot(
            appRoutes,
            { enableTracing: true } // <-- debugging purposes only
          )
        ]
      }
    );
  });

  it('should instantiate component', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance instanceof AppComponent).toBe(true, 'should create AppComponent');
  });

  // it('should have expected <h1> text', () => {
  //   let fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();

  //   let h1 = fixture.debugElement.query(el => el.name === 'h1').nativeElement;  // it works

  //   h1 = fixture.debugElement.query(By.css('h1')).nativeElement;            // preferred

  //   expect(h1.innerText).toMatch(/extrapolite/i, '<h1> should say something about "Extrapolite"');
  // });
});
