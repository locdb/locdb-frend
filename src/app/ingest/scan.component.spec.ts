import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { ScanComponent } from './scan.component';
import { LocdbService, CredentialsService } from '../locdb.service'

import { FeedComponent, FeedReaderComponent } from './feed-reader/feed-reader.component';
import { FeedService } from './feed.service';
// api
import { ScanService } from '../typescript-angular-client/api/scan.service'
import { UserService } from '../typescript-angular-client/api/user.service'
import { UtilsService } from '../typescript-angular-client/api/utils.service'
import { BibliographicEntryService } from '../typescript-angular-client/api/bibliographicEntry.service'
import { BibliographicResourceService } from '../typescript-angular-client/api/bibliographicResource.service'

import { HttpClientModule } from '@angular/common/http';

import { BsModalService } from 'ngx-bootstrap/modal';
import { ModalModule } from 'ngx-bootstrap/modal';
describe('ScanComponent', () => {
  let component: ScanComponent;
  let fixture: ComponentFixture<ScanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScanComponent, FeedReaderComponent, FeedComponent ],
      imports: [ FormsModule, HttpModule, HttpClientModule, ModalModule.forRoot()],
      providers: [ LocdbService, HttpModule, CredentialsService, FeedService,
        ScanService,
        UserService,
        UtilsService,
        BibliographicResourceService,
        BibliographicEntryService,
        BsModalService]
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

  it('should extract with pages', () => {
    expect(component.extractidandPages('123456789_10-12.pdf')).toEqual(['123456789', 10, 12]);
    // difficult since delimiter between PPN and firstpage is the same as between pages itself
    expect(component.extractidandPages('123456789-10-12.pdf')).toEqual(['123456789', 10, 12]);
    // now single page filenames
    expect(component.extractidandPages('123456789-10-10.pdf')).toEqual(['123456789', 10, 10]);
    expect(component.extractidandPages('123456789_10-12.pdf')).toEqual(['123456789', 10, 12]);
  });

  it('should extract single page', () => {
    expect(component.extractidandPages('123456789-10.pdf')).toEqual(['123456789', 10, 10]);
  });

  it('should extract doi', () => {
    // just ppn
    expect(component.extractDOI('10.1086.657507')).toEqual('10.1086.657507');
    // with page numbers
  });

  it('should extract doi generic', () => {
    // just ppn
    expect(component.extractidandPages('10.1086.657507.pdf')[0]).toEqual('10.1086.657507');
    // with page numbers
  });

});
