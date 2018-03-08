// basic angular http client stuff
import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, RequestOptions, Headers } from '@angular/http';

import { TypedResourceView, enums } from './locdb';


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
    // we should not rely on LOCDB URL anymore. TODO FIXME
    return `${this.locdbUrl}/scans/${identifier}`;
  }

  deleteScan(scan: ToDoScans) {
    return this.bibliographicEntryApi.remove(scan._id);
  }


  /* Resources API end */
  addTargetBibliographicResource(entry: BibliographicEntry, resource: BibliographicResource): Observable<BibliographicResource> {
    return this.bibliographicEntryApi.addTargetBibliographicResource(entry._id, resource._id).map( br => new TypedResourceView(br) );
  }

  removeTargetBibliographicResource(entry): Observable<BibliographicResource> {
    return this.bibliographicEntryApi.removeTargetBibliographicResource(entry._id).map( br => new TypedResourceView(br) );
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
        entry.status = enums.status.ocrProcessed; // back-end does it... TODO FIXME
      } catch (e) {
        console.log('References pointer was invalid. Pass...');
      }
      entry.references = '';
    }
    await this.addTargetBibliographicResource(entry, resource);
    /* to keep view consistent */
    entry.status = enums.status.valid;
    entry.references = resource._id;
    return Promise.resolve(entry);
  }

  bibliographicResource(identifier: string): Observable<TypedResourceView> {
    return this.bibliographicResourceApi.get(identifier).map( br => new TypedResourceView(br) );
  }

  parentResource(br: TypedResourceView | BibliographicResource): Observable<TypedResourceView> {
    return this.bibliographicResource(br.partOf);
  }

  async safeCommitLink(
    entry: BibliographicEntry,
    resource: TypedResourceView
  ): Promise<TypedResourceView> {
    /* if necessary, creates target resource before updating the reference of the entry */
    /* 1-3 requests */
    const target = await this.maybePostResource(resource).toPromise();
    await this.updateTargetResource(entry, target);
    return target;
  }




  maybePutResource(
    resource: TypedResourceView
  ): Observable<TypedResourceView> {
    /* Update the resource if it is known to the backend
     * 0-1 */
    if (!resource._id) {
      return Observable.of(resource);
    } else {
      return this.bibliographicResourceApi.update(resource._id, resource.data).map( br => new TypedResourceView(br) );
    }
  }

  maybePostResource(tr: TypedResourceView): Observable<TypedResourceView> {
    /* Post the resource if it is not stored in back-end yet
     * TODO potential problem here, when resource is incomplete
     * 0-1 backend requests */
    if (!tr._id) {
      // !!! Never ever forget this when on righthand-side, they should never be external
      tr.status = enums.status.valid;
      return this.bibliographicResourceApi.save(tr.data).map( br => new TypedResourceView(br) );
    } else {
      return Observable.of(tr);
    }
  }



  // DEPRECATED or integrate in Maybe Methods
  putBibliographicResource(resource: TypedResourceView): Observable<TypedResourceView> {
    return this.bibliographicResourceApi.update(resource._id, resource.data).map( br => new TypedResourceView(br));
  }

  pushBibligraphicResource(resource: TypedResourceView): Observable<TypedResourceView> {
    return this.bibliographicResourceApi.save(resource).map( br => new TypedResourceView(br));
  }

  deleteBibliographicResource(resource: TypedResourceView) : Observable<SuccessResponse> {
    return this.bibliographicResourceApi.deleteSingle(resource._id);
  }
  /* Resources API end */

  deleteBibliographicEntry(entry: BibliographicEntry) : Observable<BibliographicEntry> {
    return this.bibliographicEntryApi.remove(entry._id);
  }

  updateBibliographicEntry(entry: BibliographicEntry) {
    // status must be set to 'VALID' before, if performed by user.
    return this.bibliographicEntryApi.update(entry._id, entry);
  }

  createBibliographicEntry(resource_id: string, entry: BibliographicEntry): Observable<BibliographicEntry> {
    return this.bibliographicEntryApi.create(resource_id, entry);
  }

  /* The following needs to be reconsidered, actually we could store login status here */
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
