import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceShortComponent } from './resource-short.component';

describe('ResourceShortComponent', () => {
  let component: ResourceShortComponent;
  let fixture: ComponentFixture<ResourceShortComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourceShortComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceShortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
