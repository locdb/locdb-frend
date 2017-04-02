import { Component } from '@angular/core';
import { Citation } from './citation';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  // template: `
  //     <div class="panel panel-default" style="margin-top: 10px">
  //       <div class="panel-heading"><h1>{{title}}</h1></div>
  //       <div class="panel-body">
  //         <citation-form></citation-form>
  //       </div>
  //     </div>
  //     `
})
export class AppComponent {
  title = 'LOC-DB ~ Extrapolite';
  candidates: Citation[];

  updateCandidates(newCandidates: Citation[]) {
    this.candidates = newCandidates;
    console.log('Updated candidates', this.candidates);
  }
}

