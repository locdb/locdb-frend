import { Component, OnInit, Input } from '@angular/core';
import { BibliographicResource } from '../locdb';

@Component({
  selector: 'app-resource-short',
  templateUrl: './resource-short.component.html',
  styleUrls: ['./resource-short.component.css']
})
export class ResourceShortComponent implements OnInit {
  @Input() resource: BibliographicResource;
  format = 'ACM'; // maybe helpful later
  constructor() { }

  ngOnInit() {
  }

}
