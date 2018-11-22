import { Injectable } from '@angular/core';
import { models, enums, TypedResourceView } from '../locdb';
import * as interact from 'interact.js';

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

  /* It is nessesary to ensure only one interactjs initialization
   (across all routeraccessable pages)to prevent a overlappbug interact
  listening functions */
  isInitialized = false
  initInteract(){
    if(!this.isInitialized){
      this.setUpInteractFunctions()
      console.log('[inspector][debug] interactjs initialized')
      this.isInitialized = true
    }
    else{
      console.log('[inspector][debug] interactjs already set up')
    }
  }


  setUpInteractFunctions() {
    interact('.resizeable-rect')
      .draggable({
        restrict: {
          restriction: 'parent',
          elementRect: { top: 1, left: 1, bottom: 1, right: 1 }
        },
      })
      .resizable({
        // resize from all edges and corners
        edges: { left: true, right: true, bottom: true, top: true },

        // keep the edges inside the parent
        restrictEdges: {
          outer: 'parent',
          endOnly: true,
        },

        // minimum size
        restrictSize: {
          min: { width: 100, height: 50 },
        },

        inertia: true,
      })
      .on('resizemove', function (event) {
        const min_width = 50
        const min_height = 20
        let target = event.target,
            x = (parseFloat(target.getAttribute('x')) || 0),
            y = (parseFloat(target.getAttribute('y')) || 0);
        // update the element's style
        let svg = target.parentNode.parentNode
        const imgWidth = svg.attributes.viewBox.value.split(' ')[2]
        const imgHeight = svg.attributes.viewBox.value.split(' ')[3]
        let svgWidth = svg.parentNode.clientWidth //|| svg.width.baseVal.value
        let svgHeight = svg.parentNode.clientHeight //|| svg.height.baseVal.value
        // const translateX = svg.transform.baseVal[0].matrix.e
        // console.log(translateX)
        // const translateY = svg.transform.baseVal[0].matrix.f
        // console.log(translateY)
        const scaleX = svg.transform.baseVal[1].matrix.a
        // console.log(scaleX)
        const scaleY = svg.transform.baseVal[1].matrix.d
        // console.log(scaleY)
        let width  = event.rect.width;
        let height = event.rect.height;
        let deltaLeft = event.deltaRect.left;
        let deltaTop = event.deltaRect.top;

        if(width < min_width){
          width = min_width
          deltaLeft = 0
        }
        if(height < min_height){
          height = min_height
          deltaTop = 0
        }

        const clientToImageWidthRatio = imgWidth / svgWidth
        const clientToImageHeightRatio = imgHeight / svgHeight
             // translate when resizing from top or left edges
        x += deltaLeft * clientToImageWidthRatio / scaleX;
        y += deltaTop * clientToImageHeightRatio / scaleY;
        // console.log(clientToImageWidthRatio)
        // console.log(clientToImageHeightRatio)
        // console.log(scaleX)
        // console.log(scaleY)
        // console.log(deltaLeft)
        // console.log(deltaTop)

        // deactivate resize if zoom is active on firefox
        if(!("InstallTrigger" in window) || scaleX < 1.05){
          target.setAttribute('width', width * clientToImageWidthRatio / scaleX);
          target.setAttribute('height', height * clientToImageHeightRatio / scaleY);
          target.setAttribute('x', x);
          target.setAttribute('y', y);
        }})
       .on('dragmove', function (event){
         let target = event.target,
         x = (parseFloat(target.getAttribute('x')) || 0),
         y = (parseFloat(target.getAttribute('y')) || 0);

         let svg = target.parentNode.parentNode
         const imgWidth = svg.attributes.viewBox.value.split(' ')[2]
         const imgHeight = svg.attributes.viewBox.value.split(' ')[3]
         let svgWidth = svg.parentNode.clientWidth // || svg.parentNode.parentNode.clientWidth
         // offsetWidth
         let svgHeight = svg.parentNode.clientHeight //|| svg.parentNode.parentNode.clientHeight


         const scaleX = svg.transform.baseVal[1].matrix.a
         // console.log(scaleX)
         const scaleY = svg.transform.baseVal[1].matrix.d
         // console.log(scaleY)
         // console.log(event.dx)
         // console.log(event.dy)
         // console.log(x)
         // console.log(y)
         const clientToImageWidthRatio = imgWidth / svgWidth
         const clientToImageHeightRatio = imgHeight / svgHeight

         x += event.dx * clientToImageWidthRatio / scaleX;
         y += event.dy * clientToImageHeightRatio  / scaleY;

         // deactivate resize if zoom is active on firefox
         if(!("InstallTrigger" in window) || scaleX < 1.05){
           target.setAttribute('x', x);
           target.setAttribute('y', y);
         }
      });
  }


}
