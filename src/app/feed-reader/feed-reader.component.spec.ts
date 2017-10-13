import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedReaderComponent } from './feed-reader.component';

describe('FeedReaderComponent', () => {
  let component: FeedReaderComponent;
  let fixture: ComponentFixture<FeedReaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedReaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedReaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
