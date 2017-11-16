import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';


import { AppComponent } from './app.component';

// d3
import * as d3 from 'd3';

// ngx-bootstrap
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { AccordionModule } from 'ngx-bootstrap/accordion';

// misc
import { CredentialsService } from 'angular-with-credentials';
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
    PopoverModule
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
  ],
  providers: [ LocdbService, CredentialsService ],
  bootstrap: [ AppComponent ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
