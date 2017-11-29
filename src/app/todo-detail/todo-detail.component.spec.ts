import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoDetailComponent } from './todo-detail.component';
import { EntryListComponent } from '../entry-list/entry-list.component';
import { EntryFormComponent } from '../entry-form/entry-form.component';
import { DisplayComponent } from '../display/display.component';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { HotkeyModule, HotkeysService } from 'angular2-hotkeys';
import { ReactiveFormsModule } from '@angular/forms';
import { LocdbService, CredentialsService } from '../locdb.service';
import { HttpModule } from '@angular/http';


describe('TodoDetailComponent', () => {
  let component: TodoDetailComponent;
  let fixture: ComponentFixture<TodoDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ AccordionModule.forRoot(), HotkeyModule.forRoot(), ReactiveFormsModule, HttpModule],
      declarations: [ TodoDetailComponent, EntryListComponent, EntryFormComponent, DisplayComponent ],
      providers: [LocdbService, CredentialsService, HotkeysService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
