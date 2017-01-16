import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `<h1>{{name}}</h1>
    <section class="container-fluid">
    <div class="row" style="margin-top: 10px">
    <div class="col-xs-12 col-sm-6 col-md-4">
    <scan></scan>
    </div>
    <div class="col-xs-12 col-sm-6 col-md-4">
    <reference></reference>
    </div>
    </div>
    </section>`,
})
export class AppComponent  { name = 'LOC-DB Extrapolate'; }
