import { Component, Input } from '@angular/core'

import { BibliographicResource } from './bibliographic-resource'

@Component({
  moduleId: module.id,
  selector: 'reference',
  templateUrl: 'reference.component.html'
})

export class ReferenceComponent {
  @Input()
  bibliographicResources : BibliographicResource[];




}

