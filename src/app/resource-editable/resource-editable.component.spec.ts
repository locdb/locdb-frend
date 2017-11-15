import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceEditableComponent } from './resource-editable.component';
import { ResourceForm } from '../resource-form/resource-form.component';
import { Resource } from '../resource/resource.component';

describe('ResourceEditableComponent', () => {
  let component: ResourceEditableComponent;
  let fixture: ComponentFixture<ResourceEditableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourceEditableComponent, ResourceForm, Resource ]
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
