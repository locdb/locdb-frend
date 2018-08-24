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
    // prevent unnessesary overwriting and shuffeling of the scans array
    if (!this.checkContentEquality(this._scans, scans)) {
      console.log("Set scans", scans)
      if (this._currentScan >= scans.length){
        this._currentScan = 0;}
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

  /* position from pagination starts at 1 while array indexing starts at 0,
      pos getter and setter manage this accordingly*/
  get pos() {
    // console.log("getpos", this._currentScan, this.scans[this._currentScan])
    return this._currentScan + 1;
  }

  set pos(p: number) {
    if (p < 1){
      console.log("[warning] index " + p + " out of range")
    }
    this._currentScan = p - 1;
    // console.log("setpos", this._currentScan, this.scans[this._currentScan])
  }

  get totalScans() {
    return this._scans.length;
  }

  checkContentEquality(a: any[], b: any[]) {
    return a.every(e => b.indexOf(e) !== -1) && a.length == b.length;
  }

}
