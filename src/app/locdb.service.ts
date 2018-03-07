// basic angular http client stuff
import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, RequestOptions, Headers } from '@angular/http';

import { TypedResource } from './locdb';


import {
  BibliographicEntryApi, BibliographicResourceApi,
  ScanApi, UserApi
} from './typescript-angular2-client/api/api';

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
  Feed, FeedEntry,
  OCRData,
  User,
  SuccessResponse
} from './locdb'


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
    private scanApi: ScanApi,
    private userApi: UserApi,
    private bibliographicEntryApi: BibliographicEntryApi,
    private bibliographicResourceApi: BibliographicResourceApi,
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
    console.log(error)
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
    return this.scanApi.getToDo(status_);
  }

  getToDoBibliographicEntries(scan_id: string): Observable<BibliographicEntry[]> {
    // fetches list of entries for a scan id
    return this.bibliographicEntryApi.getToDoBibliographicEntries(scan_id);
  }

  public saveResource(
   identifierScheme: string,
   identifierLiteralValue: string,
   resourceType: string,
   firstPage?: number,
   lastPage?: number,
   textualPdf?: boolean,
   binaryFile?: any,
   stringFile?: string,
   embodimentType?: string,
   extraHttpRequestParams?: any
 ) {
   return this.scanApi.saveResource(identifierScheme, identifierLiteralValue,
   resourceType, firstPage, lastPage, textualPdf, binaryFile, stringFile,
   embodimentType);
 }

  /* SHOULD NOT BE NEEDED because of saveResource above */
  saveScan(
    ppn: string,
    resourceType: string,
    textualPdf: boolean,
    file: File,
    firstPage?: string,
    lastPage?: string
  ): Observable<ToDoScans> {
    // DEPRECATED
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
    // DEPRECATED
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
    // DEPRECATED
    const url = `${this.locdbUrl}/saveElectronicJournal`
    const params: URLSearchParams = new URLSearchParams();
    params.set(identifier.scheme, identifier.literalValue);
    return this.http.get(
      url,
      { search: params}
    ).map(this.extractData).catch(this.handleError);
  }
  /* SHOULD NOT BE NEEDED because of saveResource above */

  suggestionsByEntry(be: BibliographicEntry, external?: boolean): Observable<BibliographicResource[]> {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });

    const url = external ? `${this.locdbUrl}/getExternalSuggestions` : `${this.locdbUrl}/getInternalSuggestions`

    return this.http.post(url, be, options)
      .map(response => response.json() as BibliographicResource[])
      .catch(this.handleError);
  }

  suggestionsByQuery(query: string, external: boolean, threshold?: number): Observable<BibliographicResource[]> {
    if (external) {
      return this.bibliographicEntryApi.getExternalSuggestionsByQueryString(query, threshold);
    } else {
      return this.bibliographicEntryApi.getInternalSuggestionsByQueryString(query, threshold);
    }

  }


  triggerOcrProcessing(scanId: string) {
    return this.scanApi.triggerOcrProcessing(scanId);
  }

  getScan(identifier: string) {
    return `${this.locdbUrl}/scans/${identifier}`;
  }

  deleteScan(scan: ToDoScans) {
    return this.bibliographicEntryApi.remove(scan.id);
  }

  putBibliographicEntry(entry: BibliographicEntry) {
    // obsolete by addTarget
    return this.bibliographicEntryApi.update(entry.id, entry);
  }


  /* Resources API end */
  addTargetBibliographicResource(entry: BibliographicEntry, resource: BibliographicResource): Observable<BibliographicResource> {
    return this.bibliographicEntryApi.addTargetBibliographicResource(entry.id, resource.id).map( br => new TypedResource(br) );
  }

  removeTargetBibliographicResource(entry): Observable<BibliographicResource> {
    return this.bibliographicEntryApi.removeTargetBibliographicResource(entry.id).map( br => new TypedResource(br) );
  }

  async updateTargetResource(
    entry: BibliographicEntry,
    resource: BibliographicResource
  ): Promise<BibliographicEntry> {
    /* adds or update link from entry to resource
     * 1-2 requests */
    if (entry.references) {
      try {
        await this.removeTargetBibliographicResource(entry);
        entry.status = 'OCR_PROCESSED'; // back-end does it... TODO FIXME
      } catch (e) {
        console.log('References pointer was invalid. Pass...');
      }
      entry.references = '';
    }
    await this.addTargetBibliographicResource(entry, resource);
    /* to keep view consistent */
    entry.status = 'VALID';
    entry.references = resource.id;
    return Promise.resolve(entry);
  }

  bibliographicResource(identifier: string): Observable<BibliographicResource> {
    return this.bibliographicResourceApi.get(identifier).map( br => new TypedResource(br) );
  }

  async safeCommitLink(
    entry: BibliographicEntry,
    resource: BibliographicResource
  ): Promise<BibliographicResource> {
    /* if necessary, creates target resource before updating the reference of the entry */
    /* 1-3 requests */
    const target = await this.maybePostResource(resource).toPromise();
    await this.updateTargetResource(entry, target);
    return target;
  }




  maybePutResource(
    resource: BibliographicResource
  ): Observable<BibliographicResource> {
    /* Update the resource if it is known to the backend
     * 0-1 */
    if (!resource.id) {
      return Observable.of(resource);
    } else {
      return this.bibliographicResourceApi.update(resource.id, resource);
    }
  }

  maybePostResource(resource: TypedResource): Observable<TypedResource> {
    /* Post the resource if it is not stored in back-end yet
     * TODO a problem here, when resource is incomplete
     * 0-1 backend requests */
    if (!resource._id) {
      const url = `${this.locdbUrl}/bibliographicResources`;
      resource.status = 'VALID'; // they should never be external
      return this.bibliographicResourceApi.save(resource).map( br => new TypedResource(br) );
    } else {
      return Observable.of(resource);
    }
  }



  putBibliographicResource(resource: BibliographicResource): Observable<BibliographicResource> {
    return this.bibliographicResourceApi.update(resource.id, resource);
  }

  pushBibligraphicResource(resource: BibliographicResource): Observable<BibliographicResource> {
    return this.bibliographicResourceApi.save(resource);
  }

  deleteBibliographicResource(resource: BibliographicResource) {
    return this.bibliographicResourceApi.deleteSingle(resource.id);
  }
  /* Resources API end */

  deleteBibliographicEntry(entry: BibliographicEntry) {
    return this.bibliographicEntryApi.remove(entry.id);
    }
  newBibliographicEntry(): BibliographicEntry {
    // TODO FIXME Mock
    let entry = {identifiers:[{scheme: "PPP", literalValue: "2444666668888888"}]};
    return entry;

  }

  /* The following needs to be reconsidered, actually we could store login status here */

  fail(err: any): Observable<any> {
    // array ok? TODO FIXME
    return Observable.from([{ok: false}]);
  }

  /** User and Instance Management */

  login(username: string, password: string): Observable<User> {
    const user: User = {username: username, password: password};
    return this.userApi.login(user);
  }

  register(username: string, password: string): Observable<User> {
    // const headers = new Headers({ 'Content-Type': 'application/json' });
    // const options = new RequestOptions({ headers: headers, withCredentials: true });
    const user: User = {username: username, password: password};
    return this.userApi.signup(user);
  }

  logout(): Observable<SuccessResponse> {
    return this.userApi.logout();
  }


  //
  addFeed(feed: Feed): Observable<User> {
    return this.userApi.addFeed(feed);
  }

  fetchFeeds(): Observable<FeedEntry[][]> {
    return this.userApi.fetchFeeds();
  }

  deleteFeed(identifier: string): Observable<User> {
    return this.userApi.deleteFeed(identifier);
  }
} // LocdbService
