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

  printState(scan: ToDoScans) {
    if (!scan) { return '' };
    if (scan.status === ToDoStates.ocr) { return 'OCR processed' } ;
    if (scan.status === ToDoStates.nocr) { return  'not OCR processed '};
    if (scan.status === ToDoStates.iocr) { return 'OCR processing' };
    if (scan.status === ToDoStates.ext)  { return 'external' };
    return scan.status
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
