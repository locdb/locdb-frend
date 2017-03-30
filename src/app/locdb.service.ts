// basic angular http client stuff
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

// advanced rxjs async handling
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

// types
import { TodoBR } from './todo';
import { Citation } from './citation';

// dummy data
import { MOCK_TODOBRS } from './mock-todos';
import { REFERENCES, EXTERNAL_REFERENCES } from './mock-references';

@Injectable()
export class LocdbService {

  // we could read this from some config file
  private locdbUrl                      = 'http://velsen.informatik.uni-mannheim:80/';

  private locdbTodoEndpoint             = this.locdbUrl + 'getToDo'
  private locdbSaveScan                 = this.locdbUrl + 'saveScan'
  private bibliographicResourceEndpoint = this.locdbUrl + 'bibliographicResources'
  private bibliographicEntriesEndpoint  = this.locdbUrl + 'getToDoBibliographicEntries'

  constructor(private http: Http) { }


  // Generic helpers for data extraction and error handling
  
  private extractData(res: Response) {
    let body = res.json();
    return body.data || { };
  }

  private handleError (error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

  // acquire todo items and scans
  getTodos(): Observable<TodoBR[]> {
    return this.http.get(this.locdbTodoEndpoint)
                    .map(this.extractData)
                    // .map(this.flattenTodos)
                    .catch(this.handleError);
  }

  saveScan(ppn: string, firstPage: number, lastPage: number, scan: any) {
    this.http.post(this.locdbSaveScan, {ppn, firstPage, lastPage, scan})
      .map(this.extractData)
      .catch(this.handleError);
  }

  // related to bibligraphic entries

  // related to bibliographic resources
  // getBibliographicResources(forTodo: Todo) {
  //   console.log('Querying appropriate BResources for', forTodo);

  //   return Promise.resolve(REFERENCES);
  // }

  // getExternalBibliographicResources(forTodo: Todo) {
  //   console.log('Querying external BResources for', forTodo);

  //   return Promise.resolve(REFERENCES);
  // }


}
