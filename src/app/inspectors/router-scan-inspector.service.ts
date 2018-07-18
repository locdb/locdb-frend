import { Injectable } from '@angular/core';
import { models, enums, TypedResourceView } from '../locdb';

@Injectable()
export class ScanListService {
  private _scans: models.Scan[] = [];
  private _currentScan: number = 0;

  get scans(){
    return this._scans
  }

  set scans(scans: models.Scan[]){
    if (!this.checkContentEquality(this._scans, scans)){
      this._currentScan = 0;
      this._scans = scans
    }
  }

  get scan(){
    return this.scans[this._currentScan]
  }

  get nextScan(){
    if (this._scans.length > this._currentScan){
      this._currentScan += 1
      return this.scans[this._currentScan]
    }
    else {
      return this.scans[this._currentScan]
    }
  }

  get prevScan(){
    if (this._currentScan > 0){
      this._currentScan -= 1
      return this.scans[this._currentScan]
    }
    else {
      return this.scans[this._currentScan]
    }
  }

  get pos(){
    return this._currentScan
  }

  addScan(scan: string){
    // TODO necessary?
  }

  checkContentEquality(a: any[], b: any[]){
    return a.every(e => b.indexOf(e) != -1) && a.length == b.length
  }

}
