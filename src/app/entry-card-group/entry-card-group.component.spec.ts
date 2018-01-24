import { async, ComponentFixture, TestBed } from '@angular/core/testing';


import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { EntryCardGroupComponent } from './entry-card-group.component';
import { HotkeyModule } from 'angular2-hotkeys';
import { AccordionModule} from 'ngx-bootstrap/accordion';
import { LocdbService, CredentialsService } from '../locdb.service';
import { LoggingService } from '../logging.service';
import { HttpModule } from '@angular/http';

describe('EntryFormComponent', () => {
  let component: EntryCardGroupComponent;
  let fixture: ComponentFixture<EntryCardGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, HotkeyModule, AccordionModule, HttpModule],
      declarations: [ EntryCardGroupComponent ],
      providers: [ LocdbService, CredentialsService, LoggingService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryCardGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
