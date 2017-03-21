import { Component, Output, EventEmitter } from '@angular/core';

import { Todo, TodoScan } from './todo';
import { MOCK_TODOBRS } from './mock-todos';

@Component({
  selector: 'todolist',
  templateUrl: 'todo.component.html' ,
})
export class TodoComponent {
  title = 'Select todo item';
  todos: TodoScan[] = TodoComponent.flattenTodos(MOCK_TODOBRS);
  selectedTodo: TodoScan;
  @Output() eventEmitter: EventEmitter<string> = new EventEmitter();

  onSelect(todo: TodoScan): void {
    this.selectedTodo = todo;
    console.log('Todo item selected', todo._id);
    this.eventEmitter.next(todo._id);
  }

  private static flattenTodos(nestedTodos): TodoScan[] {
    let todos = []
    for (let todobr of nestedTodos) {
      for (let todopart of todobr.parts) {
        for (let todoscan of todopart.scans) {
          todos = todos.concat(todoscan);
        }
      }
    }
    // let todos = nestedTodos.map(nested => <Todo[]>nested.parts).map(part => <TodoScan[]>part.scans).concat();
    console.log(<TodoScan[]>todos)
    return <TodoScan[]>todos;
  }
}
