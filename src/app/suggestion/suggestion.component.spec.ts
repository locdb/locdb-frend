import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestionComponent } from './suggestion.component';
import { ResourceAccordionGroupComponent } from '../resource-accordion-group/resource-accordion-group.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { ResourceEditableComponent } from '../resource-editable/resource-editable.component';
import { ResourceFormComponent } from '../resource-form/resource-form.component';
import { MetadataComponent } from '../metadata/metadata.component';
import { HttpModule } from '@angular/http';
import { LocdbService, CredentialsService } from '../locdb.service';
import { PopoverModule } from 'ngx-popover';
import { LoggingService } from '../logging.service';
import { ResourceCardComponent } from '../resource-card/resource-card.component'
import { AuthorsPipe, EditorsPipe, PublisherPipe, EmbracePipe} from '../pipes';
// api
import { ScanService } from '../typescript-angular-client/api/scan.service'
import { UserService } from '../typescript-angular-client/api/user.service'
import { UtilsService } from '../typescript-angular-client/api/utils.service'
import { BibliographicEntryService } from '../typescript-angular-client/api/bibliographicEntry.service'
import { BibliographicResourceService } from '../typescript-angular-client/api/bibliographicResource.service'

import { HttpClientModule }  from '@angular/common/http';
describe('SuggestionComponent', () => {
  let component: SuggestionComponent;
  let fixture: ComponentFixture<SuggestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ModalModule.forRoot(),
        AccordionModule.forRoot(),
        ReactiveFormsModule,
        FormsModule,
        HttpModule,
        PopoverModule,
        HttpModule,
        HttpClientModule,
      ],
      declarations: [
        SuggestionComponent,
        // ResourceComponent,
        ResourceFormComponent,
        ResourceEditableComponent,
        ResourceAccordionGroupComponent,
        ResourceCardComponent,
        MetadataComponent,
        AuthorsPipe,
        EditorsPipe,
        PublisherPipe,
        EmbracePipe,
      ],
      providers: [ LocdbService, CredentialsService, LoggingService,
        ScanService,
        UserService,
        UtilsService,
        BibliographicResourceService,
        BibliographicEntryService, ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
