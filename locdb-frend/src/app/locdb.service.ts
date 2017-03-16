// basic angular http client stuff
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

// advanced rxjs async handling
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

// types
import { Todo } from './todo';
import { Citation } from './citation';

// dummy data
import { TODOS } from './mock-todos';
import { REFERENCES, EXTERNAL_REFERENCES } from './mock-references';

@Injectable()
export class LocdbService {
  private locdbUrl = 'http://velsen.informatik.uni-kiel/';

  constructor(private http: Http) { }

  getTodos(): Promise<Todo[]> {

    return Promise.resolve(TODOS);

  }

  getBibliographicResources(forTodo: Todo) {
    console.log('Querying appropriate BResources for', forTodo);

    return Promise.resolve(REFERENCES);
  }

  getExternalBibliographicResources(forTodo: Todo) {
    console.log('Querying external BResources for', forTodo);

    return Promise.resolve(REFERENCES);
  }

}
