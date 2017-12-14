import { Component, OnInit, Input} from '@angular/core';
import { Output, EventEmitter } from '@angular/core';


import { ToDoScans, Status } from '../locdb';

@Component({
  selector: 'app-todo-leaf',
  templateUrl: './todo-leaf.component.html',
  styleUrls: ['./todo-leaf.component.css']
})
export class TodoLeafComponent implements OnInit {
  @Input() leaf: ToDoScans;
  @Output() select: EventEmitter<boolean> = new EventEmitter();
  @Output() remove: EventEmitter<boolean> = new EventEmitter();
  states = Status;

  constructor() { }

  ngOnInit() {
  }

  printState() {
    if (!this.leaf) { return '' };
    if (this.leaf.status === Status.ocr) { return 'OCR processed' } ;
    if (this.leaf.status === Status.nocr) { return  'not OCR processed '};
    if (this.leaf.status === Status.iocr) { return 'OCR processing' };
    if (this.leaf.status === Status.ext)  { return 'External' };
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
