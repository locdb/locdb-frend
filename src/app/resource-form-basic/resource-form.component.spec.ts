import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceFormBasicComponent } from './resource-form.component';

import { BrowserModule } from '@angular/platform-browser';

import { FormGroup, FormGroupName, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

describe('ResourceFormBasicComponent', () => {
  let component: ResourceFormBasicComponent;
  let fixture: ComponentFixture<ResourceFormBasicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserModule,
                FormsModule,
                ReactiveFormsModule,
                ],
      declarations: [ ResourceFormBasicComponent,
                      FormGroup,
                      FormGroupName
      ],
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
