import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestionComponent } from './suggestion.component';
import { ResourceAccordionGroupComponent } from '../resource-accordion-group/resource-accordion-group.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { ResourceEditableComponent } from '../resource-editable/resource-editable.component';
import { ResourceFormComponent } from '../resource-form/resource-form.component';
import { ResourceComponent } from '../resource/resource.component';
import { HttpModule } from '@angular/http';
import { LocdbService, CredentialsService } from '../locdb.service';
import { PopoverModule } from 'ngx-popover';
import { LoggingService } from '../logging.service';
import { ResourceCardGroupComponent } from '../resource-card-group/resource-card-group.component'

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
      ],
      declarations: [
        SuggestionComponent,
        ResourceComponent,
        ResourceFormComponent,
        ResourceEditableComponent,
        ResourceAccordionGroupComponent,
        ResourceCardGroupComponent,
      ],
      providers: [ LocdbService, CredentialsService, LoggingService ]
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
