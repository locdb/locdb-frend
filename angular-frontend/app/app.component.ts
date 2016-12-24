import { Component } from '@angular/core';
@Component({
  selector: 'loc-db',
  template: `
      <div class="panel panel-default" style="margin-top: 10px">
        <div class="panel-heading"><h1>{{title}}</h1></div>
        <div class="panel-body">
        <citation-form></citation-form>
      </div>
      `
})
export class AppComponent {
  title =  'LOC-DB ~ Extrapolate';
}

