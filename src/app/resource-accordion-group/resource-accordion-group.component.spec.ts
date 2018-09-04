import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceAccordionGroupComponent } from './resource-accordion-group.component';
// import { ResourceComponent } from '../resource/resource.component';
import { ResourceEditableComponent } from '../resource-editable/resource-editable.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { ResourceCardComponent } from '../resource-card/resource-card.component';
import { ResourceFormComponent } from '../resource-form/resource-form.component';

import { StandardPipe } from '../pipes/type-pipes';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

import { MetadataComponent } from '../metadata/metadata.component'
import { AuthorsPipe, ContainerPipe, EditorsPipe, PublisherPipe, EmbracePipe} from '../pipes';

describe('ResourceAccordionGroupComponent', () => {
  let component: ResourceAccordionGroupComponent;
  let fixture: ComponentFixture<ResourceAccordionGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TypeaheadModule.forRoot(),
        AccordionModule, ReactiveFormsModule ],
      declarations: [
        ResourceFormComponent, 
        ResourceAccordionGroupComponent,
        MetadataComponent,
        AuthorsPipe,
        EditorsPipe,
        PublisherPipe,
        EmbracePipe,
      StandardPipe, ContainerPipe]
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
