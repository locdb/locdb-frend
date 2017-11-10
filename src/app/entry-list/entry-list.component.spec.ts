import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryListComponent } from './entry-list.component';
import { EntryFormComponent } from '../entry-form/entry-form-compnent';
import { HotkeyModule } from 'angular2-hotkeys';

describe('EntryListComponent', () => {
  let component: EntryListComponent;
  let fixture: ComponentFixture<EntryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntryListComponent, EntryFormComponent ],
      imports: [ HotkeyModule ]
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
