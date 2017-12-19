import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
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
import { ScanComponent } from './scan.component';
import { DisplayComponent } from './display/display.component';
import { LocdbService } from './locdb.service';
import { SuggestionComponent } from './suggestion/suggestion.component';
import { LoginComponent } from './login/login.component';
import { VisualComponent } from './visual/visual.component';
import { CommitComponent } from './commit/commit.component';

// todo related
import { TodoComponent } from './todo.component';
import { TodoDetailComponent } from './todo-detail/todo-detail.component';
import { TodoListComponent } from './todo-list/todo-list.component';
import { TodoLeafComponent } from './todo-leaf/todo-leaf.component';

// feeds
import { FeedComponent, FeedReaderComponent } from './feed-reader/feed-reader.component';

// entries
import { EntryListComponent } from './entry-list/entry-list.component';
import { EntryFormComponent } from './entry-form/entry-form.component';

// resource related
import { ResourceComponent } from './resource/resource.component';
import { ResourceFormComponent } from './resource-form/resource-form.component';
import { ResourceEditableComponent } from './resource-editable/resource-editable.component';
import { ResourceAccordionGroupComponent } from './resource-accordion-group/resource-accordion-group.component';
import { AppwrapperComponent } from './appwrapper/appwrapper.component';
import { FrontpageComponent } from './frontpage/frontpage.component';

import { LoggingService } from './logging.service'

const appRoutes: Routes = [
  { path: 'resolve', component: AppwrapperComponent },
  { path: 'ingest', component: ScanComponent},
  { path: 'browse', component: SuggestionComponent},
  { path: 'frontpage', component: FrontpageComponent},
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
    EntryFormComponent,
    SuggestionComponent,
    ResourceFormComponent,
    LoginComponent,
    VisualComponent,
    CommitComponent,
    FeedReaderComponent,
    FeedComponent,
    EntryListComponent,
    TodoDetailComponent,
    TodoListComponent,
    TodoLeafComponent,
    ResourceComponent,
    ResourceAccordionGroupComponent,
    ResourceEditableComponent,
    AppwrapperComponent,
    FrontpageComponent,
  ],
  providers: [
    LocdbService,
    CredentialsService,
    // {provide: APP_BASE_HREF, useValue : bhref}
    LoggingService,
  ],
  bootstrap: [ AppComponent ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
