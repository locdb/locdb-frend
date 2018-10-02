import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// api
import { ScanService } from '../typescript-angular-client/api/scan.service'
import { UserService } from '../typescript-angular-client/api/user.service'
import { UtilsService } from '../typescript-angular-client/api/utils.service'
import { BibliographicEntryService } from '../typescript-angular-client/api/bibliographicEntry.service'
import { BibliographicResourceService } from '../typescript-angular-client/api/bibliographicResource.service'


import { QuestionService } from '../resource-form/dynamic-question-form/question.service';
import { DynamicFormQuestionComponent } from '../resource-form/dynamic-question-form/dynamic-form-question.component';

import { BrowseComponent } from './browse.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { ResourceFormComponent } from '../resource-form/resource-form.component';
import { ResourceCardComponent } from '../resource-card/resource-card.component';
import { ResourcePairFormComponent } from '../resource-form/resource-pair-form.component';
import { MetadataComponent } from '../metadata/metadata.component'
// import { ResourceComponent } from '../resource/resource.component';
import { HttpModule } from '@angular/http';
import { LocdbService, CredentialsService } from '../locdb.service';
import { PopoverModule } from 'ngx-popover';
import { LoggingService } from '../logging.service';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

import { AuthorsPipe, ContainerPipe, EditorsPipe, PublisherPipe, EmbracePipe} from '../pipes';
import { StandardPipe } from '../pipes/type-pipes';

import { HttpClientModule } from '@angular/common/http';

describe('BrowseComponent', () => {
  let component: BrowseComponent;
  let fixture: ComponentFixture<BrowseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TypeaheadModule.forRoot(),
        ModalModule.forRoot(),
        AccordionModule.forRoot(),
        ReactiveFormsModule,
        FormsModule,
        HttpModule,
        PopoverModule,
        HttpClientModule,
      ],
      declarations: [
        BrowseComponent,
        ResourceCardComponent,
        ResourceFormComponent,
        ResourcePairFormComponent,
        MetadataComponent,
        AuthorsPipe,
        EditorsPipe,
        PublisherPipe,
        EmbracePipe,
        StandardPipe,
        ContainerPipe,
        DynamicFormQuestionComponent,
      ],
      providers: [
        LocdbService,
        CredentialsService,
        LoggingService,
        ScanService,
        UserService,
        UtilsService,
        BibliographicResourceService,
        BibliographicEntryService,
        QuestionService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
