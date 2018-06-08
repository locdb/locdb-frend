import { OnChanges, Component, Input, Output, EventEmitter} from '@angular/core';
import { models, enums, TypedResourceView } from '../locdb';
import { LocdbService } from '../locdb.service';
import { Router, ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  providers: [ LocdbService ],
})
export class TodoComponent implements OnChanges {
  @Input() todo: TypedResourceView = null;
  @Input() container: TypedResourceView = null;
  @Input() showAsContainer = false;
  @Output() scan: EventEmitter<[models.ResourceEmbodiment, models.Scan]> = new EventEmitter();
  @Output() refs: EventEmitter<Array<models.BibliographicEntry>> = new EventEmitter();
  // empty list indicates no scans
  embodiment_scans = [];

  constructor(private route: ActivatedRoute,
              private router: Router) {}

  ngOnChanges() {
    this.embodiment_scans = this.getScans(this.todo.embodiedAs);
  }

  inspectReferences() {
    this.refs.emit(this.todo.parts);
  }

  inspectScan(embodiment_scan: [models.ResourceEmbodiment, models.Scan]) {
    this.scan.emit([embodiment_scan[0], embodiment_scan[1]]);
  }

  edit() {
    this.router.navigate(['/edit/'], { queryParams: { resource: this.todo._id} });
  }

  unpackFirstPage(emsc) {
    return emsc[0].firstPage;
  }

  unpackLastPage(emsc) {
    return emsc[0].lastPage;
  }

  unpackType(emsc) {
    return emsc[0].type;
  }

  unpackFormat(emsc) {
    return emsc[0].format;
  }

  unpackScanName(emsc) {
    return emsc[1].scanName;
  }

  getScans(embodiments: Array<models.ResourceEmbodiment>): Array<[models.ResourceEmbodiment, models.Scan]> {
    const scans: Array<[models.ResourceEmbodiment, models.Scan]> = []
    for (const embodiment of embodiments) {
      if (embodiment.scans.length > 0) {
        for (const scan of embodiment.scans) {
          scans.push([embodiment, scan])
        }
      }
    }
    return scans
  }

  dummy(s) {
    console.log('dummy ' , s);
  }


}
