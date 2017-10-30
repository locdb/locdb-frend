import { Component, OnInit, Input, OnChanges} from '@angular/core';
import { ToDoScans } from '../locdb';

@Component({
  selector: 'app-todo-detail',
  templateUrl: './todo-detail.component.html',
  styleUrls: ['./todo-detail.component.css']
})
export class TodoDetailComponent implements OnInit, OnChanges {
  scanShown = false;
  @Input() _id: string;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    // fetch entries for todo item

  }


  viewScan(state: boolean) {
    this.scanShown = state;
  }

}
