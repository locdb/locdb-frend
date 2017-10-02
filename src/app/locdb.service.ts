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

import { synCites_ } from './locdb'

// Local testing with credentials
import { CredentialsService } from 'angular-with-credentials';

// dummy data
import { MOCK_TODOBRS } from './mock-todos';
import { REFERENCES, EXTERNAL_REFERENCES } from './mock-references';


import { environment } from 'environments/environment';

@Injectable()
export class LocdbService {
  private locdbUrl = environment.locdbUrl;

  private locdbTodoEndpoint: string;
  private locdbSaveScan: string;
  private locdbTodoEntries: string;
  private locdbTodoResources: string;
  private internalSuggestions: string;
  private externalSuggestions: string;
  private locdbTriggerOcrProcessing: string;
  private locdbBibliographicEntries: string;
  private locdbBibliographicResources: string;

  constructor(
    private http: Http,
    private credentials: CredentialsService
  ) {
    if (this.credentials) { // This is here to help with testing so you can pass in null for CredentialsService
      this.credentials.augmentXhrBuild((xhr: any) => {
        xhr.withCredentials = true;
      });
    }
    this.updateUrls();
  }


  private updateUrls() {
    /* It would be also fine to construct the urls in the respective methods */
    this.locdbTodoEndpoint             = this.locdbUrl + '/getToDo';
    this.locdbSaveScan                 = this.locdbUrl + '/saveScan';
    this.locdbTodoEntries              = this.locdbUrl + '/getToDoBibliographicEntries';
    // This url just does not exist yet
    this.locdbTodoResources            = this.locdbUrl + '/getToDoBibliographicResources';
    this.internalSuggestions           = this.locdbUrl + '/getInternalSuggestions';
    this.externalSuggestions           = this.locdbUrl + '/getExternalSuggestions';
    this.locdbTriggerOcrProcessing     = this.locdbUrl + '/triggerOcrProcessing';
    this.locdbBibliographicEntries     = this.locdbUrl + '/bibliographicEntries/';
    // just a guess
    this.locdbBibliographicResources   = this.locdbUrl + '/bibliographicResources/';
  }


  // Generic helpers for data extraction and error handling
  private extractData(res: Response) {
    console.log('Response', res);
    const body = res.json();
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

  getToDo(ocr_processed: boolean): Observable<ToDo[]> {
    // acquire todo items and scans
    const status_: string = ocr_processed ? 'OCR_PROCESSED' : 'NOT_OCR_PROCESSED';
    const params: URLSearchParams = new URLSearchParams();
    params.set('status', status_);
    return this.http.get(this.locdbTodoEndpoint, { search: params} )
                    .map(this.extractData)
    // .map(this.flattenTodos) // client may do this
                    .catch(this.handleError);
  }

  getToDoBibliographicEntries(scan_id: string): Observable<BibliographicEntry[]> {
    // fetches list of entries for a scan id
    const params: URLSearchParams = new URLSearchParams();
    params.set('scanId', scan_id);
    console.log('locdb todo entries url: ', this.locdbTodoEntries);
    return this.http.get(this.locdbTodoEntries, { search: params } )
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  getToDoBibliographicResources(scan_id: string): Observable<BibliographicResource[]> {
    // UNUSED //
    //
    // fetches list of entries for a scan id
    const params: URLSearchParams = new URLSearchParams();
    params.set('scanId', scan_id);
    console.log('');
    const res =  this.http.get(this.locdbTodoResources, { search: params } )
                    .map(this.extractData)
                    .catch(this.handleError);
    console.log('resources: ', res);
    return res;
  }

  saveScan(
    ppn: string,
    firstPage: string,
    lastPage: string,
    scan: any,
    file: File,
    resourceType: string
  ): Observable<any> {
    // Take FileWithMetadata object instead
    const formData: FormData = new FormData();
    console.log(ppn, firstPage, lastPage);
    console.log(file);
    formData.append('ppn', ppn);
    formData.append('firstPage', firstPage);
    formData.append('lastPage', lastPage);
    formData.append('scan', file, file.name);
    formData.append('resourceType', resourceType);
    console.log('saveScan(...) formData', formData);
    return this.http.post(this.locdbSaveScan, formData)
      .map(this.extractData)
      .catch(this.handleError);
  }

  suggestions(be: BibliographicEntry, external?: boolean): Observable<any[]> {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });

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
    const params: URLSearchParams = new URLSearchParams();
    params.set('id', scanId.toString())
    return this.http.get(
      this.locdbTriggerOcrProcessing,
      { search: params}
    ).map(this.extractData).catch(this.handleError);

  }

  getScan(identifier: string) {
    return this.locdbUrl + '/scans/' + identifier;
  }

  putBibliographicEntry(entry: BibliographicEntry) {
    const url = this.locdbBibliographicEntries + entry._id;
    return this.http.put(url, entry).map(this.extractData).catch(this.handleError);
  }

  bibliographicResource(identifier: string) {
    const url = this.locdbBibliographicResources + identifier;
    return this.http.get(url).map(this.extractData).catch(this.handleError);
  }

  putBibliographicResource(resource: BibliographicResource) {
    // we might also need post, to store completely new resources
    console.log('Put BR for', resource._id);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    const url = this.locdbBibliographicResources + resource._id;
    synCites(resource)
    console.log('JUST BEFORE SUBMISSION:', resource);
    return this.http.put(url, resource, options).map(this.extractData).catch(this.handleError);
  }

  pushBibligraphicResource(resource: BibliographicResource) {
    // we could merge this with the method above, first try put then push.
    console.log('Push BR', resource);
    const url = this.locdbBibliographicResources;
    return this.http.post(url, resource).map(this.extractData).catch(this.handleError);
  }

  /* The following needs to be reconsidered, actually we could store login status here */

  fail(err: any): Observable<any> {
    // array ok? TODO FIXME
    return Observable.from([{ok: false}]);
  }

  /** User and Instance Management */

  login(user: string, pass: string): Observable<any> {
    const headers = new Headers({'Content-Type': 'application/json', 'Accept' : 'application/json' });
    const options = new RequestOptions({ headers: headers, withCredentials: true  });
    const url = this.locdbUrl + '/login'
    console.log(options)
    return this.http.post(url, JSON.stringify({username: user, password: pass}), options).catch(this.fail);
    // return this.http.post(url, {username: user, password: pass}, options).map(this.extractData).catch(this.handleError);
  }

  signup(user: string, pass: string) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers, withCredentials: true });
    const url = this.locdbUrl + '/signup'
    return this.http.post(url, {username: user, password: pass}, options).catch(this.fail);
  }

  logout() {
    const url = this.locdbUrl + '/logout'
    return this.http.get(url).catch(this.fail);
  }

  instance(instance?: string) {
    if (instance) { this.locdbUrl = instance } ;
    this.updateUrls();
    return this;
  }


} // LocdbService
