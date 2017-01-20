import { Component, Input , Output, EventEmitter} from '@angular/core';
import { Citation } from "./citation"
import { REFERENCES, REFERENCES_ALT } from './mock-references'
console.log("Log works.");
@Component({
  moduleId: module.id,
  selector: 'scan',
  templateUrl: 'scan.component.html'
})


export class ScanComponent {
  src = '';
  references : Citation[][] = [REFERENCES, REFERENCES_ALT];
  ref_idx: number = 0;
  @Output() eventEmitter : EventEmitter<Citation[]> = new EventEmitter();

  onChange(event:any) {
    let files = event.srcElement.files;
    this.src = files[0].name;
    console.log("[ScanComponent] onChange(event) called with files:", files);
  }

  next(diff:number) {
    this.ref_idx = Math.abs((this.ref_idx + diff) % this.references.length)
    console.log("New current reference index", this.ref_idx);
    this.eventEmitter.next(this.references[this.ref_idx])
  }
}
