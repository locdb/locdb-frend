import { Injectable } from '@angular/core';
import { models, enums, TypedResourceView } from '../locdb';

@Injectable()
export class ScanListService {
  /**
   * List service supplying data for pagination
   *
   */
  private _scans: models.Scan[] = [];
  private _currentScan: number = 0;

  get scans() {
    return this._scans;
  }

  set scans(scans: models.Scan[]) {
    if (!this.checkContentEquality(this._scans, scans)) {
      console.log("Set scans", scans)
      this._currentScan = 0;
      this._scans = scans;
    }
  }

  get scan() {
    console.log("Returned nr ",this._currentScan, this.scans[this._currentScan], "of", this.scans)
    return this.scans[this._currentScan]
  }

  get nextScan() {
    if (this._currentScan < this._scans.length - 1) { this._currentScan += 1 }
    return this.scans[this._currentScan]
  }

  get prevScan() {
    if (this._currentScan > 0) { this._currentScan -= 1; }
    return this.scans[this._currentScan];
  }

  get pos() {
    console.log("getpos", this._currentScan, this.scans[this._currentScan])
    return this._currentScan + 1;
  }

  set pos(p: number) {
    this._currentScan = p - 1;
    console.log("setpos", this._currentScan, this.scans[this._currentScan])
  }

  get totalScans() {
    return this._scans.length;
  }


  addScan(scan: string) {
    // TODO necessary?
    // Lukas: guess not
  }

  checkContentEquality(a: any[], b: any[]) {
    return a.every(e => b.indexOf(e) != -1) && a.length == b.length;
  }

}
