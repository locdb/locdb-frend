import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditViewComponent } from './edit-view.component';

import { ResourceFormBasicComponent } from '../resource-form-basic/resource-form.component'
import { EntryFormComponent } from '../inspectors/entry-form/entry-form.component'


import { FormGroup, FormGroupName, FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('EditViewComponent', () => {
  let component: EditViewComponent;
  let fixture: ComponentFixture<EditViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditViewComponent,
                      ResourceFormBasicComponent,
                      EntryFormComponent ],
      imports: []
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
