import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoLeafComponent } from './todo-leaf.component';

describe('TodoLeafComponent', () => {
  let component: TodoLeafComponent;
  let fixture: ComponentFixture<TodoLeafComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TodoLeafComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoLeafComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
