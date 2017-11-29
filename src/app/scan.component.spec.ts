import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { ScanComponent } from './scan.component';
import { LocdbService, CredentialsService } from './locdb.service'

import { FeedComponent, FeedReaderComponent } from './feed-reader/feed-reader.component';
import { FeedService } from './feed.service';

describe('ScanComponent', () => {
  let component: ScanComponent;
  let fixture: ComponentFixture<ScanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScanComponent, FeedReaderComponent, FeedComponent ],
      imports: [ FormsModule, HttpModule ],
      providers: [ LocdbService, HttpModule, CredentialsService, FeedService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should extract', () => {
    // just ppn
    expect(component.extractidandPages('123456789.pdf')[0]).toBe('123456789');
    expect(component.extractidandPages('12345678X.pdf')[0]).toBe('12345678X');
    expect(component.extractidandPages('02345678X.pdf')[0]).toBe('02345678X');
    // with page numbers
  });

  it('should extract', () => {
    expect(component.extractidandPages('123456789_10-12.pdf')).toEqual(['123456789', 10, 12]);
    // difficult since delimiter between PPN and firstpage is the same as between pages itself
    expect(component.extractidandPages('123456789-10-12.pdf')).toEqual(['123456789', 10, 12]);
    // now single page filenames
    expect(component.extractidandPages('123456789-10-10.pdf')).toEqual(['123456789', 10, 10]);
    expect(component.extractidandPages('123456789-10.pdf')).toEqual(['123456789', 10, 10]);
  });

});
