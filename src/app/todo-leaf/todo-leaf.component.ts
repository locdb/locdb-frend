import { Component, OnInit, Input} from '@angular/core';
import { Output, EventEmitter } from '@angular/core';


import { ToDoScans, ToDoStates } from '../locdb';

@Component({
  selector: 'app-todo-leaf',
  templateUrl: './todo-leaf.component.html',
  styleUrls: ['./todo-leaf.component.css']
})
export class TodoLeafComponent implements OnInit {
  @Input() leaf: ToDoScans;
  @Output() select: EventEmitter<boolean> = new EventEmitter();
  @Output() remove: EventEmitter<boolean> = new EventEmitter();
  states = ToDoStates;

  constructor() { }

  ngOnInit() {
  }

  printState() {
    if (!this.leaf) { return '' };
    if (this.leaf.status === ToDoStates.ocr) { return 'OCR processed' } ;
    if (this.leaf.status === ToDoStates.nocr) { return  'not OCR processed '};
    if (this.leaf.status === ToDoStates.iocr) { return 'OCR processing' };
    if (this.leaf.status === ToDoStates.ext)  { return 'External' };
    return this.leaf.status
  }

  trimHash(identifier: string) {
    // heuristic :)
    return identifier.slice(0, 7);
  }

  onSelect() {
    this.select.next(true);
  }

  onRemove() {
    this.remove.next(true);
  }

}
