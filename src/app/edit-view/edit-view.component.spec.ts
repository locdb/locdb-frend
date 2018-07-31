import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, InjectionToken } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { environment } from 'environments/environment';
import { BASE_PATH } from '../typescript-angular-client/variables';
import { EditViewComponent } from './edit-view.component';
import { LocdbService } from '../locdb.service';
import { CredentialsService } from '../locdb.service';
import { ScanService } from '../typescript-angular-client/api/scan.service';
import { UserService } from '../typescript-angular-client/api/user.service';
import { BibliographicEntryService } from '../typescript-angular-client/api/bibliographicEntry.service';
import { BibliographicResourceService } from '../typescript-angular-client/api/bibliographicResource.service';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { TypeaheadModule } from 'ngx-bootstrap';

import { RouterModule, Routes } from '@angular/router';
import { ResourceFormBasicComponent } from '../resource-form-basic/resource-form.component'
import { EntryFormComponent } from '../inspectors/entry-form/entry-form.component'

import { BrowserModule } from '@angular/platform-browser'
import { FormGroup, FormGroupName, FormsModule, ReactiveFormsModule } from '@angular/forms';

const appRoutes: Routes = [
  // { path: 'resolve/:bin', component: LinkingComponent },
  // { path: 'ingest', component: ScanComponent},
  // { path: 'browse', component: BrowseComponent},
  // { path: 'frontpage', component: FrontpageComponent},
  // { path: 'linking/RefsInspector/:id', component: RouterRefsInspectorComponent},
  // { path: 'linking/ScanInspector/:id', component: RouterScanInspectorComponent},
  { path: 'edit', component: EditViewComponent},

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

describe('EditViewComponent', () => {
  let component: EditViewComponent;
  let fixture: ComponentFixture<EditViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TypeaheadModule.forRoot(),
        HttpModule,
        HttpClientModule,
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forRoot(
          appRoutes,
          {enableTracing: true }
        )
      ],
      declarations: [ EditViewComponent,
        ResourceFormBasicComponent,
        EntryFormComponent,
        ],
      providers: [
        { provide: BASE_PATH, useValue: environment.locdbUrl},
        // below: for karma/jasmine purposes
        { provide: APP_BASE_HREF, useValue: 'localhost:9876'},
        LocdbService,
        ScanService,
        UserService,
        BibliographicEntryService,
        BibliographicResourceService,
        CredentialsService],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
