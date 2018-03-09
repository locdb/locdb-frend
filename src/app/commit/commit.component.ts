import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { TypedResourceView, BibliographicEntry } from '../locdb';
import { LocdbService } from '../locdb.service';

@Component({
  selector: 'app-commit',
  templateUrl: './commit.component.html',
  styleUrls: ['./commit.component.css']
})
export class CommitComponent implements OnInit {

  @Input() source: TypedResourceView = null;
  @Input() entry: BibliographicEntry = null;
  @Input() target: TypedResourceView = null;

  @Output() committed: EventEmitter<[TypedResourceView, BibliographicEntry, TypedResourceView]> = new EventEmitter();


  constructor(private locdbService: LocdbService) { }

  ngOnInit() {
  }



  commit() {
    // This the actual linking of entry to resource
    // do we need to validate form commit?
    this.entry.references = this.target._id;
    this.source.cites.push(this.target._id);
    // we should update the resource not the entry TODO FIXME
    this.locdbService.safeCommitLink(this.entry,this.target).then( (result) => {
      console.log('Submitted Entry with result', result);
      this.committed.next([this.source, this.entry, this.target])
    });

  }


}
