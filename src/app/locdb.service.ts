// basic angular http client stuff
import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, RequestOptions, Headers } from '@angular/http';

// advanced rxjs async handling;
import {Observable} from 'rxjs/Rx';
// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/operator/catch';
// import 'rxjs/add/operator/map';

// new types
import {
  Identifier,
  ToDo,
  ToDoScans,
  BibliographicEntry,
  BibliographicResource,
  ProvenResource,
  Feed
} from './locdb'

import { synCites_ } from './locdb'

// Local testing with credentials
// import { CredentialsService } from 'angular-with-credentials';

// dummy data
import { MOCK_TODOBRS } from './mock-todos';
import { REFERENCES, EXTERNAL_REFERENCES } from './mock-references';

import 'rxjs/add/operator/toPromise';


import { environment } from 'environments/environment';

@Injectable()
export class CredentialsService {
  private http: any;
  private _augmentFunctions = <any>[];

  constructor( http: Http) {
    this.http = <any>http;
    const build = this.http._backend._browserXHR.build;
    this.http._backend._browserXHR.build = () => {
      const xhr = build();
      this._augmentFunctions.forEach( (f: any) => {
        f(xhr);
      });
      return xhr;
    };
  }

  public augmentXhrBuild(f: any) {
    this._augmentFunctions.push(f);
  }
}

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
    textualPdf: boolean,
    file: File,
    firstPage?: string,
    lastPage?: string
  ): Observable<ToDoScans> {
    // Take FileWithMetadata object instead
    const url = `${this.locdbUrl}/saveScan`;
    const formData: FormData = new FormData();
    formData.append('ppn', ppn);
    if (firstPage && lastPage) {
      formData.append('firstPage', firstPage);
      formData.append('lastPage', lastPage);
    }
    formData.append('textualPdf', textualPdf.toString());
    formData.append('scan', file);
    formData.append('resourceType', resourceType);
    return this.http.post(url, formData).map(
      (s) => s.json() as ToDoScans
    ).catch(this.handleError);
  }

  saveScanForElectronicJournal(
    scheme: string,
    value: string,
    textualPdf: boolean,
    file: File
  ): Observable<ToDoScans> {
    const url = `${this.locdbUrl}/saveScanForElectronicJournal`;
    const formData: FormData = new FormData();
    formData.append(scheme, value);
    formData.append('textualPdf', textualPdf.toString());
    formData.append('scan', file);
    return this.http.post(
      url,
      formData,
    ).map((s) => s.json() as ToDoScans).catch(this.handleError);
  }


  saveElectronicJournal(identifier: Identifier): Observable<any> {
    const url = `${this.locdbUrl}/saveElectronicJournal`
    const params: URLSearchParams = new URLSearchParams();
    params.set(identifier.scheme, identifier.literalValue);
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

  suggestionsByQuery(query: string, external: boolean, threshold?: string): Observable<BibliographicResource[] | ProvenResource> {
    const params: URLSearchParams = new URLSearchParams();
    params.set('query', encodeURI(query));
    if (threshold) {
      params.set('threshold', encodeURI(threshold));
    }

    console.log(params);
    const options = new RequestOptions({ search: params });

    if (external) {
      const url = `${this.locdbUrl}/getExternalSuggestionsByQueryString`;
      return this.http.get(url, options)
        .map(response => (response.json() as BibliographicResource[])
          .map(x => new ProvenResource(x)))
        .catch(this.handleError);
    } else {
      const url = `${this.locdbUrl}/getInternalSuggestionsByQueryString`;
      return this.http.get(url, options)
        .map(response => (response.json() as BibliographicResource[])
          .map(x => new ProvenResource(x)))
        .catch(this.handleError);
    }

  }


  triggerOcrProcessing(scanId: string) {
    const params: URLSearchParams = new URLSearchParams();
    params.set('id', scanId.toString());
    // const headers = new Headers({ 'Content-Type': 'application/json' });
    // const options = new RequestOptions(
    //   { headers: headers, search: params }
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

  deleteScan(scan: ToDoScans) {
    const url = `${this.locdbUrl}/scans/${scan._id}`
    return this.http.delete(url).map(this.extractData).catch(this.handleError);
  }

  putBibliographicEntry(entry: BibliographicEntry) {
    // obsolete by addTarget
    const url = `${this.locdbUrl}/bibliographicEntries/${entry._id}`;
    return this.http.put(url, entry).map(this.extractData).catch(this.handleError);
  }

  addTargetBibliographicResource(entry: BibliographicEntry, resource: BibliographicResource):
  Observable<BibliographicResource> {
    console.log('add Target', entry, resource);
    const url = `${this.locdbUrl}/addTargetBibliographicResource`;
    const params: URLSearchParams = new URLSearchParams();
    params.set('bibliographicEntryId', entry._id);
    params.set('bibliographicResourceId', resource._id);
    return this.http.get(url, { search: params}).map(this.extractData).catch(this.handleError);
  }

  removeTargetBibliographicResource(entry): Promise<any> {
    const url = `${this.locdbUrl}/removeTargetBibliographicResource`;
    const params: URLSearchParams = new URLSearchParams();
    params.set('bibliographicEntryId', entry._id);
    return this.http.get(url, { search: params}).map(this.extractData).catch(this.handleError).toPromise();
  }

  bibliographicResource(identifier: string): Observable<BibliographicResource> {
    const url = `${this.locdbUrl}/bibliographicResources/${identifier}`;
    return this.http.get(url).map(this.extractData).catch(this.handleError);
  }

  async safeCommitLink(
    entry: BibliographicEntry,
    resource: BibliographicResource
  ): Promise<BibliographicResource> {
    /* if necessary, creates target resource before updating the reference of the entry */
    /* 1-3 requests */
    const target = await this.maybePostResource(resource);
    await this.updateTargetResource(entry, target);
    return target;
  }


  async updateTargetResource(
    entry: BibliographicEntry,
    resource: BibliographicResource
  ): Promise<BibliographicEntry> {
    /* adds or update link from entry to resource
     * 1-2 requests */
    if (entry.references) {
      await this.removeTargetBibliographicResource(entry);
      entry.status = 'OCR_PROCESSED'; // back-end does it... TODO FIXME
    }
    await this.addTargetBibliographicResource(entry, resource).toPromise();
    /* to keep view consistent */
    entry.status = 'VALID';
    entry.references = resource._id;
    return entry;
  }


  maybePutResource(
    resource: BibliographicResource
  ): Promise<BibliographicResource> {
    /* Update the resource if it is known to the backend
     * 0-1 */
    if (!resource._id) {
      return Promise.resolve(resource);
    } else {
      const url = `${this.locdbUrl}/bibliographicResources/${resource._id}`;
      return this.http.put(
        url,
        resource
      ).map(
        resp => resp.json() as BibliographicResource
      ).catch(this.handleError).toPromise();
    }
  }

  maybePostResource(resource: BibliographicResource): Promise<BibliographicResource> {
    /* Post the resource if it is not stored in back-end yet
     * 0-1 backend requests */
    if (!resource._id) {
      const url = `${this.locdbUrl}/bibliographicResources`;
      return this.http.post(
        url,
        resource
      ).map(
        resp => resp.json() as BibliographicResource
      ).catch(this.handleError).toPromise();
    } else {
      return Promise.resolve(resource);
    }
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
    const options = new RequestOptions({ headers: this.headers });
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
    const options = new RequestOptions({ headers: this.headers  });
    // return this.http.post(url, {username: user, password: pass}, options).catch(this.fail);
    return this.http.post(
      url,
      {username: user, password: pass},
      options,
    ).catch(this.fail);
  }

  logout(): Observable<any> {
    const url = `${this.locdbUrl}/logout`
    const options = new RequestOptions({ headers: this.headers  });
    return this.http.get(
      url,
      options
    );
  }


  //
  addFeed(name: string, url: string): Observable<Feed> {
    const reqUrl = `${this.locdbUrl}/addFeed`;
    return this.http.post(
      reqUrl,
      {name: name, url},
      {headers: this.headers}
    ).map(res => res.json() as Feed);
  }

  fetchFeeds(): Observable<Feed[]> {
    const url = `${this.locdbUrl}/fetchFeeds`;
    return this.http.get(
      url,
      {headers: this.headers}
    ).map(res => res.json() as Feed[]);
  }

  deleteFeed(identifier: string): Observable<Feed[]> {
    const url = `${this.locdbUrl}/deleteFeed/${identifier}`;
    return this.http.get(
      url,
      {headers: this.headers}
    ).map(res => res.json()['feeds'] as Feed[])
  }
} // LocdbService
