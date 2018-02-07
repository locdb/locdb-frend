import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryListComponent } from './entry-list.component';
import { EntryFormComponent } from '../entry-form/entry-form.component';
import { HotkeyModule, Hotkey, HotkeysService } from 'angular2-hotkeys';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { LoggingService } from '../logging.service';
import { AppEntryCardGroup } from '../entry-card-group/entry-card-group.component';

describe('EntryListComponent', () => {
  let component: EntryListComponent;
  let fixture: ComponentFixture<EntryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntryListComponent, EntryFormComponent ],
      imports: [ HotkeyModule.forRoot(), AccordionModule, ReactiveFormsModule, HttpModule],
      providers: [ HotkeysService, LoggingService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
