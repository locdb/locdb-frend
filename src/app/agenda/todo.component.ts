import { OnChanges, Component, Input, Output, EventEmitter} from '@angular/core';
import { models, enums, TypedResourceView } from '../locdb';
import { LocdbService } from '../locdb.service';
import { Router, ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  providers: [ LocdbService ],
})
export class TodoComponent {
  @Input() todo: TypedResourceView = null;
  @Input() container: TypedResourceView = null;
  @Output() scan: EventEmitter<[models.ResourceEmbodiment, models.Scan]> = new EventEmitter();
  @Output() refs: EventEmitter<Array<models.BibliographicEntry>> = new EventEmitter();

  constructor(private route: ActivatedRoute,
              private router: Router) {}

  ngOnChanges() {
    // console.log(this.todo)
  }

  inspectReferences() {
    this.refs.emit(this.todo.parts);
  }

  inspectScan(embodiment_scan: [models.ResourceEmbodiment, models.Scan]) {
    this.scan.emit([embodiment_scan[0], embodiment_scan[1]]);
  }

  edit(){
    this.router.navigate(['/edit/'],{ queryParams: { resource: this.todo._id} });

  }

  unpackFirstPage(emsc){
    return emsc[0].firstPage
  }

  unpackLastPage(emsc){
    return emsc[0].lastPage
  }

  unpackType(emsc){
    return emsc[0].type
  }

  unpackFormat(emsc){
    return emsc[0].format
  }

  unpackScanName(emsc){
    return emsc[1].scanName
  }

  getScans(embodiments: [models.ResourceEmbodiment]){
    let scans: Array<[models.ResourceEmbodiment, models.Scan]> = []
    for(let embodiment of embodiments){
      if(embodiment.scans.length > 0){
        for(let scan of embodiment.scans){
          scans.push([embodiment, scan])
        }
      }
    }
    return scans
  }

  dummy(s){
    console.log("dummy " , s)
  }


}
