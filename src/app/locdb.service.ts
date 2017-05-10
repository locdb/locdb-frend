// basic angular http client stuff
import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, RequestOptions, Headers } from '@angular/http';

// advanced rxjs async handling
import {Observable} from 'rxjs/Rx';
// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/operator/catch';
// import 'rxjs/add/operator/map';

// types
import { TodoBR } from './todo';
import { Citation } from './citation';

// new types
import { ToDo, ToDoScans, BibliographicEntry, BibliographicResource } from './locdb'

// dummy data
import { MOCK_TODOBRS } from './mock-todos';
import { REFERENCES, EXTERNAL_REFERENCES } from './mock-references';

import { environment } from 'environments/environment';

@Injectable()
export class LocdbService {

  // we could read this from some config file
  // private locdbUrl                      = 'http://velsen.informatik.uni-mannheim.de:80';
  // does not work yet
  private locdbUrl = environment.locdbUrl;


  private locdbTodoEndpoint             = this.locdbUrl + '/getToDo';
  private locdbSaveScan                 = this.locdbUrl + '/saveScan';
  private bibliographicResourceEndpoint = this.locdbUrl + '/bibliographicResources';
  private locdbTodoEntries              = this.locdbUrl + '/getToDoBibliographicEntries';
  // This url just does not exist yet
  private locdbTodoResources            = this.locdbUrl + '/getToDoBibliographicResources';

  private internalSuggestions           = this.locdbUrl + '/getInternalSuggestions';
  private externalSuggestions           = this.locdbUrl + '/getExternalSuggestions';
  private locdbTriggerOcrProcessing     = this.locdbUrl + '/triggerOcrProcessing';
  private locdbBibliographicEntries     = this.locdbUrl + '/bibliographicEntries/';
  // just a guess
  private locdbBibliographicResources   = this.locdbUrl + '/bibliographicResources/';

  constructor(private http: Http) { }


  // Generic helpers for data extraction and error handling
  
  private extractData(res: Response) {
    console.log('Response', res);
    let body = res.json();
    return body;
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
    let status_: string = ocr_processed ? 'OCR_PROCESSED' : 'NOT_OCR_PROCESSED';
    let params: URLSearchParams = new URLSearchParams();
    params.set('status', status_);
    return this.http.get(this.locdbTodoEndpoint, { search: params } )
                    .map(this.extractData)
    // .map(this.flattenTodos) // client may do this
                    .catch(this.handleError);
  }

  getToDoBibliographicEntries(scan_id: string): Observable<BibliographicEntry[]> {
    // fetches list of entries for a scan id
    let params: URLSearchParams = new URLSearchParams();
    params.set('scanId', scan_id);
    console.log('locdb todo entries url: ', this.locdbTodoEntries);
    return this.http.get(this.locdbTodoEntries, { search: params } )
                    .map(this.extractData)
                    .catch(this.handleError);
  }
  
  getToDoBibliographicResources(scan_id: string): Observable<BibliographicResource[]> {
    // fetches list of entries for a scan id
    let params: URLSearchParams = new URLSearchParams();
    params.set('scanId', scan_id);
    console.log('');
    let res =  this.http.get(this.locdbTodoResources, { search: params } )
                    .map(this.extractData)
                    .catch(this.handleError);
    console.log('resources: ', res);
    return res;
  }

  saveScan(ppn: string, firstPage: string, lastPage: string, scan: any, file: File): Observable<any> {
    let formData: FormData = new FormData();
    console.log(ppn, firstPage, lastPage);
    console.log(file);
    formData.append('ppn', ppn);
    formData.append('firstPage', firstPage);
    formData.append('lastPage', lastPage);
    formData.append('scan', file, file.name);
    console.log('saveScan(...) formData', formData);
    return this.http.post(this.locdbSaveScan, formData)
      .map(this.extractData)
      .catch(this.handleError);
  }

  suggestions(be: BibliographicEntry, external?: boolean): Observable<any[]> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    if (external) {
      return this.http.post(this.externalSuggestions, be, options)
        .map(this.extractData)
        .catch(this.handleError);
    } else {
      return this.http.post(this.internalSuggestions, be, options)
        .map(this.extractData)
        .catch(this.handleError);
    }
  }

  triggerOcrProcessing(scanId: string) {
    this.locdbTriggerOcrProcessing
    let params: URLSearchParams = new URLSearchParams();
    params.set('id', scanId.toString())
    return this.http.get(
      this.locdbTriggerOcrProcessing,
      { search: params}
    ).map(this.extractData).catch(this.handleError);

  }

  getScan(identifier: string) {
    return this.locdbUrl + '/scans/' + identifier;
  }

  putBibliographicEntry(identifier: string, entry: BibliographicEntry) {
    let url = this.locdbBibliographicEntries + identifier;
    return this.http.put(url, entry).map(this.extractData).catch(this.handleError);
  }

  // we might also need post, to store completely new resources
  putBibliographicResource(identifier: string, resource: BibliographicResource) {
    console.log("Put BR", identifier);
    let url = this.locdbBibliographicResources + identifier;
    return this.http.put(url, resource).map(this.extractData).catch(this.handleError);
  }

  // helpers

} // LocdbService
