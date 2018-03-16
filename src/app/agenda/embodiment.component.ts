import { Component, Input, Output, EventEmitter} from '@angular/core';
import { models, enums } from '../locdb';
import { LocdbService } from '../locdb.service';


@Component({
  selector: 'app-embodiment',
  templateUrl: './embodiment.component.html',
  providers: [ LocdbService ],
})
export class EmbodimentComponent {
  @Input() embodiment : models.ResourceEmbodiment;
  @Output() onSelect: EventEmitter<[models.ResourceEmbodiment, models.Scan]> = new EventEmitter();

  constructor(private locdbService: LocdbService) {}


  selectScan(scan : models.Scan) {
    this.onSelect.emit([this.embodiment, scan]);
  }

  deleteScan(scan: models.Scan) {
    this.locdbService.deleteScan(scan).subscribe(
      (success) => {
        this.embodiment.scans.splice(this.embodiment.scans.indexOf(scan), 1);
        console.log('scan', scan, 'deleted');
      },
      (error) => {
        console.log('error deleting scan', scan);
      }
    );
  }
  // 2 methods to delete after chagnes
  printState(scan: models.Scan) {
    if (scan.status === enums.status.ocrProcessed) { return 'OCR processed' } ;
    if (scan.status === enums.status.notOcrProcessed) { return  'not OCR processed '};
    if (scan.status === enums.status.ocrProcessing) { return 'OCR processing' };
    if (scan.status === enums.status.external)  { return 'external' };
    return scan.status
  }

  trimHash(identifier: string) {
    // heuristic :)
    return identifier.slice(0, 7);
  }
}
