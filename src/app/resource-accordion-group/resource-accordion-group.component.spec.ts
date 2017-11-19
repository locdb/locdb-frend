import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceAccordionGroupComponent } from './resource-accordion-group.component';
import { ResourceComponent } from '../resource/resource.component';
import { ResourceFormComponent } from '../resource-form/resource-form.component';
import { ResourceEditableComponent } from '../resource-editable/resource-editable.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AccordionModule } from 'ngx-bootstrap/accordion';

describe('ResourceAccordionGroupComponent', () => {
  let component: ResourceAccordionGroupComponent;
  let fixture: ComponentFixture<ResourceAccordionGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ AccordionModule, ReactiveFormsModule ],
      declarations: [ ResourceAccordionGroupComponent, ResourceComponent, ResourceFormComponent, ResourceEditableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceAccordionGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
