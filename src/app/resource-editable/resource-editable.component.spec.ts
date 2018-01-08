import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceEditableComponent } from './resource-editable.component';
import { ResourceFormComponent } from '../resource-form/resource-form.component';
import { ResourceComponent } from '../resource/resource.component';

import { ReactiveFormsModule } from '@angular/forms';
import { LoggingService } from '../logging.service';

import { HttpModule } from '@angular/http';

describe('ResourceEditableComponent', () => {
  let component: ResourceEditableComponent;
  let fixture: ComponentFixture<ResourceEditableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports : [ ReactiveFormsModule, HttpModule ],
      declarations: [ ResourceEditableComponent, ResourceFormComponent, ResourceComponent ],
      providers: [ LoggingService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceEditableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
