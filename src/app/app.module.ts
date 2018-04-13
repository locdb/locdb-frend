import { NgModule, CUSTOM_ELEMENTS_SCHEMA, InjectionToken } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
// import { APP_BASE_HREF } from '@angular/common';

import { AppComponent } from './app.component';
import { environment } from 'environments/environment';

// d3
import * as d3 from 'd3';

// ngx-bootstrap
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { AccordionModule } from 'ngx-bootstrap/accordion';

// misc
// import { CredentialsService } from 'angular-with-credentials';
import { CredentialsService } from './locdb.service';
import { PopoverModule } from 'ngx-popover';
import { HotkeyModule } from 'angular2-hotkeys';

// own
import { ScanComponent } from './ingest/scan.component';
import { LocdbService } from './locdb.service';
import { SuggestionComponent } from './suggestion/suggestion.component';
import { LoginComponent } from './login/login.component';
import { VisualComponent } from './visual/visual.component';
import { CommitComponent } from './commit/commit.component';
import { ResourceFormBasicComponent } from './resource-form-basic/resource-form.component'

// agenda related
import { AgendaComponent, TodoComponent, EmbodimentComponent } from './agenda';

// inspector related
import { RouterRefsInspectorComponent, RouterScanInspectorComponent, RefsInspectorComponent, ScanInspectorComponent, EntryListComponent, EntryCardComponent, DisplayComponent} from './inspectors';

// feeds
import { FeedComponent, FeedReaderComponent } from './ingest/feed-reader/feed-reader.component';

// resource related
import { MetadataComponent } from './metadata/metadata.component';
import { ResourceFormComponent } from './resource-form/resource-form.component';
import { ResourceEditableComponent } from './resource-editable/resource-editable.component';
import { ResourceAccordionGroupComponent } from './resource-accordion-group/resource-accordion-group.component';
import { LinkingComponent } from './linking/linking.component';
import { FrontpageComponent } from './frontpage/frontpage.component';

import { LoggingService } from './logging.service';
import { ResourceCardComponent } from './resource-card/resource-card.component';
import { BrowseComponent } from './browse/browse.component'

import { AuthorsPipe, EditorsPipe, PublisherPipe, EmbracePipe } from './pipes';


import {
  BibliographicEntryService, BibliographicResourceService,
  ScanService, UserService
} from './typescript-angular-client/api/api';

import { BASE_PATH } from './typescript-angular-client/variables'

const appRoutes: Routes = [
  // { path: 'resolve/:NOT_OCR_PROCESSED/:OCR_PROCESSING/:OCR_PROCESSED/:EXTERNAL', component: LinkingComponent },
  { path: 'resolve/:bin', component: LinkingComponent },
  { path: 'ingest', component: ScanComponent},
  { path: 'browse', component: BrowseComponent},
  { path: 'frontpage', component: FrontpageComponent},
  { path: 'linking/RefsInspector/:id', component: RouterRefsInspectorComponent},
  { path: 'linking/ScanInspector/:id', component: RouterScanInspectorComponent},
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
   { path: 'resolve',
     redirectTo: '/resolve/0010',
     pathMatch: 'full'
    },
  { path: '**', redirectTo: '/frontpage' }
];

// const bhref = environment.production ? '/extrapolate/' : '/extrapolate-dev/'

@NgModule({
  imports: [
    AccordionModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    CollapseModule.forRoot(),
    HotkeyModule.forRoot(),
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    ReactiveFormsModule,
    PopoverModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
    ],
  declarations: [
    AppComponent,
    ScanComponent,
    TodoComponent,
    DisplayComponent,
    SuggestionComponent,
    ResourceFormComponent,
    ResourceFormBasicComponent,
    LoginComponent,
    VisualComponent,
    CommitComponent,
    FeedReaderComponent,
    FeedComponent,
    EntryListComponent,
    RefsInspectorComponent,
    ScanInspectorComponent,
    RouterRefsInspectorComponent,
    RouterScanInspectorComponent,
    MetadataComponent,
    ResourceAccordionGroupComponent,
    ResourceEditableComponent,
    LinkingComponent,
    FrontpageComponent,
    ResourceCardComponent,
    EntryCardComponent,
    BrowseComponent,
    AgendaComponent,
    TodoComponent,
    EmbodimentComponent,
    AuthorsPipe,
    EditorsPipe,
    PublisherPipe,
    EmbracePipe
  ],
  providers: [
    { provide: BASE_PATH, useValue: environment.locdbUrl},
    LocdbService,
    CredentialsService,
    // {provide: APP_BASE_HREF, useValue : bhref}
    LoggingService,
    BibliographicEntryService,
    BibliographicResourceService,
    ScanService,
    UserService
  ],
  bootstrap: [ AppComponent ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
