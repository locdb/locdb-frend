// basic angular http client stuff
import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';

// advanced rxjs async handling
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

// types
import { TodoBR } from './todo';
import { Citation } from './citation';

// new types
import { ToDo, ToDoScans, BibliographicEntry } from './locdb'

// dummy data
import { MOCK_TODOBRS } from './mock-todos';
import { REFERENCES, EXTERNAL_REFERENCES } from './mock-references';

@Injectable()
export class LocdbService {

  // we could read this from some config file
  private locdbUrl                      = 'http://velsen.informatik.uni-mannheim.de:80/';

  private locdbTodoEndpoint             = this.locdbUrl + 'getToDo'
  private locdbSaveScan                 = this.locdbUrl + 'saveScan'
  private bibliographicResourceEndpoint = this.locdbUrl + 'bibliographicResources'
  private bibliographicEntriesEndpoint  = this.locdbUrl + 'getToDoBibliographicEntries'
  private internalSuggestions           = this.locdbUrl + 'BibliographicEntry/getInternalSuggestions'
  private externalSuggestions           = this.locdbUrl + 'BibliographicEntry/getExternalSuggestions'

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
  getToDo(ocr_processed:boolean): Observable<ToDo[]> {
    let status_: string = ocr_processed ? "OCR_PROCESSED" : "NOT_OCR_PROCESSED";
    let params: URLSearchParams = new URLSearchParams();
    params.set('status', status_);
    return this.http.get(this.locdbTodoEndpoint, { search: params } )
                    .map(this.extractData)
    // .map(this.flattenTodos) // client may do this
                    .catch(this.handleError);
  }

  saveScan(ppn: string, firstPage: number, lastPage: number, scan: any) {
    let params: URLSearchParams = new URLSearchParams();
    params.set('ppn', ppn)
    params.set('firstpage', firstPage.toString())
    params.set('lastpage', lastPage.toString())
    params.set('scan', scan)
    this.http.post(this.locdbSaveScan, { search: params })
      .map(this.extractData)
      .catch(this.handleError);
  }

  suggestions(be: BibliographicEntry, external?: boolean) {
    if (external) {
      return this.http.get(this.externalSuggestions, be)
        .map(this.extractData)
        .catch(this.handleError);
    } else {
      return this.http.get(this.internalSuggestions, be)
        .map(this.extractData)
        .catch(this.handleError);
    }
  }

  getScan(identifier: string) {
    return this.locdbUrl + 'scans/' + identifier;
  }

  // helpers

} // LocdbService
