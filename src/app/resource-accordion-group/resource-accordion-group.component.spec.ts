import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceAccordionGroupComponent } from './resource-accordion-group.component';

describe('ResourceAccordionGroupComponent', () => {
  let component: ResourceAccordionGroupComponent;
  let fixture: ComponentFixture<ResourceAccordionGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourceAccordionGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceAccordionGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
