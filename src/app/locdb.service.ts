// basic angular http client stuff
import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, RequestOptions, Headers } from '@angular/http';

// advanced rxjs async handling;
import {Observable} from 'rxjs/Rx';
// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/operator/catch';
// import 'rxjs/add/operator/map';

// types
import { Citation } from './citation';

// new types
import { ToDo, ToDoScans, BibliographicEntry, BibliographicResource, Feed} from './locdb'

import { synCites_ } from './locdb'

// Local testing with credentials
import { CredentialsService } from 'angular-with-credentials';

// dummy data
import { MOCK_TODOBRS } from './mock-todos';
import { REFERENCES, EXTERNAL_REFERENCES } from './mock-references';

import 'rxjs/add/operator/toPromise';


import { environment } from 'environments/environment';

@Injectable()
export class LocdbService {
  private locdbUrl = environment.locdbUrl;

  // standard headers
  private headers: Headers = new Headers({'Content-Type': 'application/json',
                                         'Accept': 'application/json'});

  constructor(
    private http: Http,
    private credentials: CredentialsService
  ) {
    if (this.credentials) { // This is here to help with testing so you can pass in null for CredentialsService
      this.credentials.augmentXhrBuild((xhr: any) => {
        xhr.withCredentials = true;
      });
    }
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

  getToDo(status_: string): Observable<ToDo[]> {
    // acquire todo items and scans
    const url = `${this.locdbUrl}/getToDo`
    const params: URLSearchParams = new URLSearchParams();
    params.set('status', status_);
    return this.http.get(
      url,
      { search: params } // options?
    ).map(this.extractData).catch(this.handleError);
  }

  getToDoBibliographicEntries(scan_id: string): Observable<BibliographicEntry[]> {
    // fetches list of entries for a scan id
    const params: URLSearchParams = new URLSearchParams();
    params.set('scanId', scan_id);
    const url = `${this.locdbUrl}/getToDoBibliographicEntries`
    return this.http.get(url, { search: params } )
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
    const url = `${this.locdbUrl}/getToDoBibliographicResources`
    const res =  this.http.get(url, { search: params } )
    .map(this.extractData)
    .catch(this.handleError);
    console.log('resources: ', res);
    return res;
  }

  saveScan(
    ppn: string,
    resourceType: string,
    file: File,
    scan: any,
    firstPage?: string,
    lastPage?: string,
  ): Promise<any> {
    // Take FileWithMetadata object instead
    const url = `${this.locdbUrl}/saveScan`;
    const formData: FormData = new FormData();
    formData.append('ppn', ppn);
    if (firstPage && lastPage) {
      formData.append('firstPage', firstPage);
      formData.append('lastPage', lastPage);
    }

    formData.append('scan', file);
    formData.append('resourceType', resourceType);
    return this.http.post(url, formData).toPromise(); // , {headers: this.headers})
    // .map(this.extractData)
    // .catch(this.handleError);
  }

  saveElectronicJournal(doi: string): Observable<any> {
    const url = `${this.locdbUrl}/saveElectronicJournal`
    const params: URLSearchParams = new URLSearchParams();
    params.set('doi', doi);
    return this.http.get(
      url,
      { search: params}
    ).map(this.extractData).catch(this.handleError);
  }

  suggestionsByEntry(be: BibliographicEntry, external?: boolean): Observable<BibliographicResource[]> {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });

    const url = external ? `${this.locdbUrl}/getExternalSuggestions` : `${this.locdbUrl}/getInternalSuggestions`

    return this.http.post(url, be, options)
      .map(response => response.json() as BibliographicResource[])
      .catch(this.handleError);
  }

  suggestionsByQuery(query: string, external: boolean) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    const url = external ? `${this.locdbUrl}/getExternalSuggestionsByQueryString` :
      `${this.locdbUrl}/getInternalSuggestions`

    return this.http.post(url, { query : query } , options)
      .map(response => response.json() as BibliographicResource[])
      .catch(this.handleError);
  }


  triggerOcrProcessing(scanId: string) {
    const params: URLSearchParams = new URLSearchParams();
    params.set('id', scanId.toString());
    // const headers = new Headers({ 'Content-Type': 'application/json' });
    // const options = new RequestOptions(
    //   { headers: headers, withCredentials: true, search: params }
    // );
    const url = `${this.locdbUrl}/triggerOcrProcessing`;
    return this.http.get(
      url,
      { search: params }
    ).map(this.extractData).catch(this.handleError);
  }

  getScan(identifier: string) {
    return `${this.locdbUrl}/scans/${identifier}`;
  }

  putBibliographicEntry(entry: BibliographicEntry) {
    // obsolete by addTarget
    const url = `${this.locdbUrl}/bibliographicEntries/${entry._id}`;
    return this.http.put(url, entry).map(this.extractData).catch(this.handleError);
  }

  bibliographicResource(identifier: string) {
    const url = `${this.locdbUrl}/bibliographicResources/${identifier}`;
    return this.http.get(url).map(this.extractData).catch(this.handleError);
  }

  putBibliographicResource(resource: BibliographicResource) {
    // we might also need post, to store completely new resources
    console.log('Put BR for', resource._id);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    const url = `${this.locdbUrl}/bibliographicResources/${resource._id}`;
    // synCites_(resource) TODO FIXME might be incomplete so it is dangerous to invoke here
    console.log('JUST BEFORE SUBMISSION:', resource);
    return this.http.put(url, resource, options).map(this.extractData).catch(this.handleError);
  }

  pushBibligraphicResource(resource: BibliographicResource) {
    // we could merge this with the method above, first try put then push.
    console.log('Push BR', resource);
    const url = `${this.locdbUrl}/bibliographicResources`;
    return this.http.post(url, resource).map(this.extractData).catch(this.handleError);
  }

  deleteBibliographicResource(resource: BibliographicResource) {
    const url = `${this.locdbUrl}/bibliographicResources/${resource._id}`;
    console.log('Deleting', resource);
    return this.http.delete(url).map(this.extractData).catch(this.handleError);
  }

  /* The following needs to be reconsidered, actually we could store login status here */

  fail(err: any): Observable<any> {
    // array ok? TODO FIXME
    return Observable.from([{ok: false}]);
  }

  /** User and Instance Management */

  login(user: string, pass: string): Observable<any> {
    // const headers = new Headers({'Content-Type': 'application/json', 'Accept' : 'application/json' });
    const options = new RequestOptions({ headers: this.headers, withCredentials: true });
    const url = `${this.locdbUrl}/login`
    // console.log(options)
    // return this.http.post(url, JSON.stringify({username: user, password: pass}), options).catch(this.fail);
    return this.http.post(
      url,
      JSON.stringify({username: user, password: pass}),
      options
    ).catch(this.fail);
  }

  register(user: string, pass: string): Observable<any> {
    // const headers = new Headers({ 'Content-Type': 'application/json' });
    // const options = new RequestOptions({ headers: headers, withCredentials: true });
    const url = `${this.locdbUrl}/signup`
    const options = new RequestOptions({ headers: this.headers, withCredentials: true  });
    // return this.http.post(url, {username: user, password: pass}, options).catch(this.fail);
    return this.http.post(
      url,
      {username: user, password: pass},
      options,
    ).catch(this.fail);
  }

  logout(): Observable<any> {
    const url = `${this.locdbUrl}/logout`
    const options = new RequestOptions({ headers: this.headers, withCredentials: true  });
    return this.http.get(
      url,
      options
    );
  }

  instance(instance?: string) {
    if (instance) { this.locdbUrl = instance } ;
    return this;
  }
  //
  addFeed(name: string, url: string): Observable<Feed> {
    const reqUrl = `${this.locdbUrl}/addFeed`;
    return this.http.post(
      reqUrl,
      {name: name, url},
      {headers: this.headers, withCredentials: true}
    ).map(res => res.json() as Feed);
  }

  fetchFeeds(): Observable<Feed[]> {
    const url = `${this.locdbUrl}/fetchFeeds`;
    return this.http.get(
      url,
      {headers: this.headers, withCredentials: true}
    ).map(res => res.json() as Feed[]);
  }

  deleteFeed(identifier: string): Observable<Feed[]> {
    const url = `${this.locdbUrl}/deleteFeed/${identifier}`;
    return this.http.get(
      url,
      {headers: this.headers, withCredentials: true}
    ).map(res => res.json()['feeds'] as Feed[])
  }
} // LocdbService
