import { async, ComponentFixture, TestBed } from '@angular/core/testing';


import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { EntryFormComponent } from './entry-form.component';
import { HotkeyModule } from 'angular2-hotkeys';
import { AccordionModule} from 'ngx-bootstrap/accordion';
import { LocdbService, CredentialsService } from '../locdb.service';
import { LoggingService } from '../logging.service';
import { HttpModule } from '@angular/http';

describe('EntryFormComponent', () => {
  let component: EntryFormComponent;
  let fixture: ComponentFixture<EntryFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, HotkeyModule, AccordionModule, HttpModule],
      declarations: [ EntryFormComponent ],
      providers: [ LocdbService, CredentialsService, LoggingService ]
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
