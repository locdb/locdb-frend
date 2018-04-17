// basic angular http client stuff
import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, RequestOptions, Headers } from '@angular/http';

import { TypedResourceView, enums } from './locdb';


import {
  BibliographicEntryService, BibliographicResourceService,
  ScanService, UserService
} from './typescript-angular-client/api/api';

// advanced rxjs async handling;
import {Observable} from 'rxjs/Rx';
// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/operator/catch';
// import 'rxjs/add/operator/map';

// new types
import { models } from './locdb';


// Local testing with credentials
// import { CredentialsService } from 'angular-with-credentials';

// dummy data
// import { MOCK_TODOBRS } from './mock-todos';
// import { REFERENCES, EXTERNAL_REFERENCES } from './mock-references';

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
    private scanService: ScanService,
    private userService: UserService,
    private bibliographicEntryService: BibliographicEntryService,
    private bibliographicResourceService: BibliographicResourceService,
    private credentials: CredentialsService
  ) {
    if (this.credentials) { // This is here to help with testing so you can pass in null for CredentialsService
      this.credentials.augmentXhrBuild((xhr: any) => {
        xhr.withCredentials = true;
      });
    }
  }


  // Generic helpers for data extraction and error handling

  getToDo(statuses: Array<enums.status>): Observable<TypedResourceView[]> {
    // acquire todo items and scans
    return this.scanService.getToDo(statuses).map((todos) => todos.map( (todo) => new TypedResourceView(todo) ));
  }

  // /* Returns all ToDo items */
  // getAgenda(statuses: Array<enums.status>): Observable<TypedResourceView[]> {
  //   return Observable.from(statuses).flatMap(
  //     (status) => this.getToDo(status)
  //     // could sort via map by something
  //   );
  // }

  getToDoBibliographicEntries(scan_id: string): Observable<models.BibliographicEntry[]> {
    // fetches list of entries for a scan id
    return this.bibliographicEntryService.getToDoBibliographicEntries(scan_id);
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
   embodimentType?: string
 ) {
   return this.scanService.saveResource(identifierScheme, identifierLiteralValue,
   resourceType, firstPage, lastPage, textualPdf, binaryFile, stringFile,
   embodimentType);
 }


  suggestionsByQuery(query: string, external: boolean, threshold?: number): Observable<TypedResourceView[]> {
    if (external) {
      return this.bibliographicEntryService.getExternalSuggestionsByQueryString(query, threshold).map( l => l.map(br => new TypedResourceView(br)));
    } else {
      return this.bibliographicEntryService.getInternalSuggestionsByQueryString(query, threshold).map( l => l.map(br => new TypedResourceView(br)));
    }

  }


  triggerOcrProcessing(scanId: string) {
    return this.scanService.triggerOcrProcessing(scanId);
  }

  getScan(identifier: string) {
    // we should not rely on LOCDB URL anymore. TODO FIXME
    return `${this.locdbUrl}/scans/${identifier}`;
  }


  deleteScan(scan: models.Scan) {
    return this.bibliographicEntryService.remove(scan._id);
  }

  checkScanImage(identifier: string){
    return this.http.get(`${this.locdbUrl}/scans/${identifier}`)
  }



  /* Resources API end */
  addTargetBibliographicResource(entry: models.BibliographicEntry, resource_id: string): Observable<TypedResourceView> {
    return this.bibliographicEntryService.addTargetBibliographicResource(entry._id, resource_id).map( br => new TypedResourceView(br) );
  }

  removeTargetBibliographicResource(entry: models.BibliographicEntry): Observable<TypedResourceView> {
    return this.bibliographicEntryService.removeTargetBibliographicResource(entry._id).map( br => new TypedResourceView(br) );
  }

  async updateTargetResource(
    entry: models.BibliographicEntry,
    resource_id: string ): Promise<models.BibliographicEntry> {
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
    await this.addTargetBibliographicResource(entry, resource_id);
    /* to keep view consistent */
    entry.status = enums.status.valid;
    entry.references = resource_id;
    return Promise.resolve(entry);
  }

  bibliographicResource(identifier: string): Observable<TypedResourceView> {
    return this.bibliographicResourceService.get(identifier).map( br => new TypedResourceView(br) );
  }

  parentResource(br: TypedResourceView | models.BibliographicResource): Observable<TypedResourceView> {
    return this.bibliographicResource(br.partOf);
  }

  async safeCommitLink(
    entry: models.BibliographicEntry,
    resource: TypedResourceView
  ): Promise<TypedResourceView> {
    /* if necessary, creates target resource before updating the reference of the entry */
    /* 1-3 requests */
    const target = await this.maybePostResource(resource).toPromise();
    await this.updateTargetResource(entry, target._id);
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
      return this.bibliographicResourceService.update(resource._id, <models.BibliographicResource>resource.data).map( br => new TypedResourceView(br) );
    }
  }

  maybePostResource(tr: TypedResourceView): Observable<TypedResourceView> {
    /* Post the resource if it is not stored in back-end yet
     * TODO potential problem here, when resource is incomplete
     * 0-1 backend requests */
    if (!tr._id) {
      // !!! Never ever forget this when on righthand-side, they should never be external
      // 19.03.2018: Dont do this, we would corrupt todo item..
      tr.status = enums.status.valid;
      return this.bibliographicResourceService.save(<models.BibliographicResource>tr.data).map( br => new TypedResourceView(br) );
    } else {
      return Observable.of(tr);
    }
  }

  getBibliographicResource(id:string): Observable<TypedResourceView> {
    return this.bibliographicResourceService.get(id).map(br => new TypedResourceView(br));
  }

  // DEPRECATED or integrate in Maybe Methods
  putBibliographicResource(resource: TypedResourceView): Observable<TypedResourceView> {
    return this.bibliographicResourceService.update(resource._id, <models.BibliographicResource>resource.data).map( br => new TypedResourceView(br));
  }

  pushBibligraphicResource(resource: TypedResourceView): Observable<TypedResourceView> {
    return this.bibliographicResourceService.save(<models.BibliographicResource>resource.data).map( br => new TypedResourceView(br));
  }

  deleteBibliographicResource(resource: TypedResourceView) : Observable<models.SuccessResponse> {
    return this.bibliographicResourceService.deleteSingle(resource._id);
  }
  /* Resources API end */

  deleteBibliographicEntry(entry: models.BibliographicEntry) : Observable<models.BibliographicEntry> {
    return this.bibliographicEntryService.remove(entry._id);
  }

  updateBibliographicEntry(entry: models.BibliographicEntry) {
    // status must be set to 'VALID' before, if performed by user.
    return this.bibliographicEntryService.update(entry._id, entry);
  }

  createBibliographicEntry(resource_id: string, entry: models.BibliographicEntry): Observable<models.BibliographicEntry> {
    return this.bibliographicEntryService.create(resource_id, entry);
  }

  /* The following needs to be reconsidered, actually we could store login status here */
  /** User and Instance Management */

  login(username: string, password: string): Observable<models.User> {
    const user: models.User = {username: username, password: password};
    return this.userService.login(user);
  }

  register(username: string, password: string): Observable<models.User> {
    // const headers = new Headers({ 'Content-Type': 'application/json' });
    // const options = new RequestOptions({ headers: headers, withCredentials: true });
    const user: models.User = {username: username, password: password};
    return this.userService.signup(user);
  }

  logout(): Observable<models.SuccessResponse> {
    return this.userService.logout();
  }


  //
  addFeed(feed: models.Feed): Observable<models.User> {
    return this.userService.addFeed(feed);
  }

  fetchFeeds(): Observable<models.FeedEntry[][]> {
    return this.userService.fetchFeeds();
  }

  deleteFeed(identifier: string): Observable<models.User> {
    return this.userService.deleteFeed(identifier);
  }
} // LocdbService
