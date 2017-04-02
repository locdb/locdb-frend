import { Component, Output, EventEmitter } from '@angular/core';


import { ToDo, ToDoParts, ToDoScans } from './locdb';
import { MOCK_TODOBRS } from './mock-todos';

@Component({
  selector: 'todolist',
  templateUrl: 'todo.component.html' ,
})

export class TodoComponent {
  title = 'Select todo item';
  scans: ToDoScans[] = TodoComponent.flattenTodos(MOCK_TODOBRS);
  selectedTodo: ToDoScans;
  @Output() eventEmitter: EventEmitter<string> = new EventEmitter();

  onSelect(todo: ToDoScans): void {
    this.selectedTodo = todo;
    console.log('Todo item selected', todo._id);
    this.eventEmitter.next(todo._id);
  }

  private static flattenTodos(todos: ToDo[]): ToDoScans[] {
    let flatScans: ToDoScans[] = []
    for (let todo of todos) {
      for (let todopart of todo.parts) {
        for (let todoscan of todopart.scans) {
          flatScans = flatScans.concat(todoscan);
        }
      }
    }
    console.log(flatScans)
    return flatScans;
  }
}
