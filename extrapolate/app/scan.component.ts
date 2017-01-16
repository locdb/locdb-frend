import { Component, Input } from '@angular/core';
@Component({
  moduleId: module.id,
  selector: 'scan',
  templateUrl: 'scan.component.html'
})

export class ScanComponent {
  @Input()
  src = "ex_scan.png";
}
