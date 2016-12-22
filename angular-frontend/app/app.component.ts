import { Component } from '@angular/core';
export class Citation {
  public reftype: string;
  public authors: string[];
  public title: string;
  public journal: string;
  public band: number;
  public heft: number;
  public pages: string;
  public year: number;
}
  // <div style="flex:1"><img src="ex_scan.png" width=380></div>
    // <div style="flex:1">
    //   <img [src]="src" [hidden]="!src"><br>
    //   <input type="file" image-upload (imageSelected)="selected($event)"
    //     [resizeOptions="resizeOptions">
    // </div>
@Component({
  selector: 'loc-db',
  template: `
  <div class="container">
    <div class="row">
      <div class="col-md-6">
        <citation-form></citation-form>
      </div>
      <div class="col-md-5">
        <img src="ex_scan.png" class="img-responsive" alt="Scanned image">
      </div>
    </div>
  </div>
  `
})
export class AppComponent {
  // src: string = "";
  // resizeOptions: ResizeOptions = {
  //   resizeMaxWidth: 300,
  //   resizeMaxHeight: 1000
  // };
  // selected(imageResult: ImageResult) {
  //   this.src = imageResult.resized
  //     && imageResult.resized.dataURL
  //     || imageResult.dataURL;
  // }
  title = 'LOCDB';
  task = 'Literatur erschließen...';
  // citation: Citation = {
  //   reftype: 'Journal',
  //   authors: ['Abramson, L.Y.', 'Seligmann, M.E.P', 'Teasdale, J.D.'],
  //   title: 'Learned helplessness in hu-mans: Critique and reformula',
  //   journal: 'Journal of Abnormal Psychology',
  //   band: null,
  //   heft: 87,
  //   pages: '49-74',
  //   year: 1978
  // };
}

