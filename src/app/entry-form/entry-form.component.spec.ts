import { async, ComponentFixture, TestBed } from '@angular/core/testing';


import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { EntryFormComponent } from './entry-form.component';
import { HotkeyModule } from 'angular2-hotkeys';
import { AccordionModule} from 'ngx-bootstrap/accordion';
import { LocdbService } from '../locdb.service';
import { HttpModule } from '@angular/http';
import { CredentialsService } from 'angular-with-credentials';

describe('EntryFormComponent', () => {
  let component: EntryFormComponent;
  let fixture: ComponentFixture<EntryFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, HotkeyModule, AccordionModule, HttpModule],
      declarations: [ EntryFormComponent ],
      providers: [ LocdbService, CredentialsService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
