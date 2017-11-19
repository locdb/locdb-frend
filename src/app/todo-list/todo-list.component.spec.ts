import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoListComponent } from './todo-list.component';
import { ResourceComponent } from '../resource/resource.component';
import { ResourceEditableComponent } from '../resource-editable/resource-editable.component';
import { ResourceAccordionGroupComponent } from '../resource-accordion-group/resource-accordion-group.component';
import { ResourceFormComponent } from '../resource-form/resource-form.component';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { ReactiveFormsModule } from '@angular/forms';
import { LocdbService } from '../locdb.service';
import { CredentialsService } from 'angular-with-credentials';
import { HttpModule } from '@angular/http';

describe('TodoListComponent', () => {
  let component: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ AccordionModule.forRoot(), ReactiveFormsModule, HttpModule ],
      declarations: [
        TodoListComponent,
        ResourceComponent,
        ResourceFormComponent,
        ResourceEditableComponent,
        ResourceAccordionGroupComponent
      ],
      providers: [ LocdbService, CredentialsService ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
