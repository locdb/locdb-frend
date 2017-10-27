import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CredentialsService } from 'angular-with-credentials';

import { ScanComponent } from './scan.component';
import { LocdbService } from './locdb.service'

describe('ScanComponent', () => {
  let component: ScanComponent;
  let fixture: ComponentFixture<ScanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScanComponent ],
      imports: [ FormsModule, HttpModule ],
      providers: [ LocdbService, HttpModule, CredentialsService ]
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
    expect(component.extractPPNandPages('123456789.pdf')).toBe(['123456789', null, null]);
    expect(component.extractPPNandPages('12345678X.pdf')).toBe(['12345678X', null, null]);
    expect(component.extractPPNandPages('02345678X.pdf')).toBe(['02345678X', null, null]);
    // with page numbers
    expect(component.extractPPNandPages('123456789_10-12.pdf')).toBe(['123456789', '10', '12']);
    // difficult since delimiter between PPN and firstpage is the same as between pages itself
    expect(component.extractPPNandPages('123456789-10-12.pdf')).toBe(['123456789', '10', '12']);
    // now single page filenames
    expect(component.extractPPNandPages('123456789-10-10.pdf')).toBe(['123456789', '10', '10']);
    expect(component.extractPPNandPages('123456789-10.pdf')).toBe(['123456789', '10', '10']);
  });


});
