import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-visual',
  templateUrl: './visual.component.html',
  styleUrls: ['./visual.component.css']
})

export class VisualComponent implements OnInit {

  @Input() state = 0; // 0-2
  @Input() width = 300;
  @Input() height = 20;
  @Input() rp = 0.15;
  @Input() caktiv = 'lightblue';
  @Input() cinaktiv = 'lightgrey';
  @Input() cline = 'lightgreen';
  @Input() nameStart = 'Resource';
  @Input() nameMid = 'Citation';
  @Input() nameEnd = 'Resource';

  constructor() { }

  ngOnInit() {
    console.log(this.state);
  }

  pathStart() {
      console.log('pathStart', this.state);
  }

  pathSelectResource() {
      console.log('pathSelectResource');
  }

  pathEditAndSubmit() {
      console.log('pathEditAndSubmit');
  }

}
