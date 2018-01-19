import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseComponent } from './browse.component';
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

describe('BrowseComponent', () => {
  let component: BrowseComponent;
  let fixture: ComponentFixture<BrowseComponent>;

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
        BrowseComponent,
        ResourceComponent,
        ResourceFormComponent,
        ResourceEditableComponent,
        ResourceAccordionGroupComponent
      ],
      providers: [ LocdbService, CredentialsService, LoggingService ]
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
