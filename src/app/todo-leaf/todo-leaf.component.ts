import { Component, OnInit, Input} from '@angular/core';
import { Output, EventEmitter } from '@angular/core';


import { ToDoScans, enums } from '../locdb';

@Component({
  selector: 'app-todo-leaf',
  templateUrl: './todo-leaf.component.html',
  styleUrls: ['./todo-leaf.component.css']
})
export class TodoLeafComponent implements OnInit {
  @Input() leaf: ToDoScans;
  @Output() select: EventEmitter<boolean> = new EventEmitter();
  @Output() remove: EventEmitter<boolean> = new EventEmitter();
  states = enums.status;

  constructor() { }

  ngOnInit() {
  }

  printState() {
    if (!this.leaf) { return '' };
    if (this.leaf.status === enums.status.ocrProcessed) { return 'OCR ready' } ;
    if (this.leaf.status === enums.status.notOcrProcessed) { return  'OCR not ready '};
    if (this.leaf.status === enums.status.ocrProcessing) { return 'OCR waiting' };
    if (this.leaf.status === enums.status.external)  { return 'Electronic' };
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
