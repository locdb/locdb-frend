import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceFormBasicComponent } from './resource-form.component';

describe('ResourceFormComponent', () => {
  let component: ResourceFormBasicComponent;
  let fixture: ComponentFixture<ResourceFormBasicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourceFormBasicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceFormBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
