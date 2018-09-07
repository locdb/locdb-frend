import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetaResourceFormComponent } from './meta-resource-form.component';

describe('MetaResourceFormComponent', () => {
  let component: MetaResourceFormComponent;
  let fixture: ComponentFixture<MetaResourceFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetaResourceFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetaResourceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
