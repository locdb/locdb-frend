import { OnChanges, Component, Input, Output, EventEmitter} from '@angular/core';
import { gatherScansWithEmbodiment, models, enums, TypedResourceView } from '../locdb';
import { LocdbService } from '../locdb.service';
import { Router, ActivatedRoute} from '@angular/router';
import { BibliographicResourceService } from '../typescript-angular-client/api/bibliographicResource.service'


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
  embodiment_scans: Array<[models.ResourceEmbodiment, models.Scan]> = [];

  constructor(private route: ActivatedRoute,
    private router: Router,
    private locdbService: LocdbService,
    private brService: BibliographicResourceService
  ) {}

  ngOnChanges() {
    this.embodiment_scans = gatherScansWithEmbodiment(this.todo.embodiedAs, s => s.status !== enums.status.obsolete);
  }

  inspectReferences() {
    this.refs.emit(this.todo.parts);
  }

  inspectScan(embodiment_scan: [models.ResourceEmbodiment, models.Scan]) {
    console.log('[debug] in todo.inspectScan: embodiment_scan:', embodiment_scan)
    this.scan.emit([embodiment_scan[0], embodiment_scan[1]]);
  }

  edit() {
    this.router.navigate(['/edit/'], { queryParams: { resource: this.todo._id, container: this.container ? this.container._id : ''} });
  }

  fullyValidateResource() {
    if (confirm(`You are about to mark the resource '${this.todo}' as done. `
      + 'The resource will not appear on the agenda again and all of its '
      + 'unlinked reference entries will be marked as obsolete. Okay?')) {
      this.brService.setValid(this.todo._id).subscribe(
        (success) => location.reload(),
        (error) => alert('An error occurred: ' + error.message)
      );
    }
  }

  isOcrTriggerable(emsc: [models.ResourceEmbodiment, models.Scan]): boolean {
    const [emb, scan] = emsc;
    if (scan.status === enums.status.notOcrProcessed) {
      return true;
    }
    return false;
  }

  unpackFirstPage(emsc): number {
    return emsc[0].firstPage || 1;
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

  dummy(s) {
    console.log('dummy ' , s);
  }

  triggerOcrProcessing(scan: models.Scan) {
    scan.status = enums.status.ocrProcessing;
    console.log('Triggered ocr processing of', scan)
    this.locdbService.triggerOcrProcessing(scan._id).subscribe((res) => {
      console.log('OCR Processing succeeded: ', res)
      scan.status = enums.status.ocrProcessed;
    },
    (err) => { scan.status = enums.status.notOcrProcessed
                console.log('OCR Processing failed, ', err) });
  }


}
