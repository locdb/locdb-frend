import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppwrapperComponent } from './appwrapper.component';
import { ToDoComponent} from '../todo.component';
import { SuggestionComponent } from '../suggestion/suggestion.component';

describe('AppwrapperComponent', () => {
  let component: AppwrapperComponent;
  let fixture: ComponentFixture<AppwrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppwrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppwrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
