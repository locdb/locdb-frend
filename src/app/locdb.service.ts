import {Observable, of} from 'rxjs';
import {delay, take, retryWhen, retry,  map, flatMap, catchError} from 'rxjs/operators';
// basic angular http client stuff
import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, RequestOptions, Headers } from '@angular/http';


import { TypedResourceView, enums } from './locdb';


import {
  BibliographicEntryService, BibliographicResourceService,
  ScanService, UserService
} from './typescript-angular-client/api/api';


// new types
import { models } from './locdb';


// Local testing with credentials
// import { CredentialsService } from 'angular-with-credentials';

// dummy data
// import { MOCK_TODOBRS } from './mock-todos';
// import { REFERENCES, EXTERNAL_REFERENCES } from './mock-references';



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
    console.log('Using Backend ', this.locdbUrl);
  }


  // Generic helpers for data extraction and error handling

  getToDo(statuses: Array<enums.status>): Observable<TypedResourceView[]> {
    // acquire todo items and scans
    return this.scanService.getToDo(statuses).pipe(map((todos) => todos.map( (todo) => new TypedResourceView(todo) )));
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

  /* we expect the similar format of a tuple of [child, parent] or [child, null] if there is no parent */
  packTypedPair(
   childAndParent: models.BibliographicResource[],
   removeId: boolean = false
 ): [TypedResourceView, TypedResourceView | null] {
   /*
   Properly pack an array of bibliographic resources as returned by
   suggestion services into a **Pair** of parent and child typed resources
   */
   let tuple: [TypedResourceView, TypedResourceView];
   if (!childAndParent[0]) {
     console.log('[Warning] received undefined or null child resource, should never happen');
   }
   if (!childAndParent[1]) {
     // if parent is none or not even defined
     if (removeId) {
       // console.log('Removing id(s) for child')
       childAndParent[0]._id = undefined;
     }
     tuple = [new TypedResourceView(childAndParent[0]), null];
   } else {
     if (removeId) {
       // console.log('Removing id(s) for pair')
       childAndParent[0]._id = undefined;
       childAndParent[1]._id = undefined;
     }
     tuple = [new TypedResourceView(childAndParent[0]), new TypedResourceView(childAndParent[1])];
   }
   return tuple;
 }


  suggestionsByQuery(query: string, external: boolean, threshold?: number): Observable<Array<[TypedResourceView, TypedResourceView]>> {
    const entryService = this.bibliographicEntryService;
    const suggestions$ = external ?
    entryService.getExternalSuggestionsByQueryString(query, threshold) :
    entryService.getInternalSuggestionsByQueryString(query, threshold);
    return suggestions$.pipe(map(suggestions => suggestions.map(pair => this.packTypedPair(pair, external))));
  }

  precalculatedSuggestions(entry: models.BibliographicEntry): Observable<Array<[TypedResourceView, TypedResourceView]>> {
    const suggestions$ = this.bibliographicEntryService.getPrecalculatedSuggestions(entry._id);
    return suggestions$.pipe(map(suggestions => suggestions.map(pair => this.packTypedPair(pair, true))));
  }


  triggerOcrProcessing(scanId: string) {
    return this.scanService.triggerOcrProcessing(scanId);
  }

  getScanURL(identifier: string) {
    // we should not rely on LOCDB URL anymore. TODO FIXME
    return `${this.locdbUrl}/scans/${identifier}`;
  }


  deleteScan(scan: models.Scan) {
    return this.bibliographicEntryService.remove(scan._id);
  }


  getScan(identifier: string, observe: any = 'body') {
    return this.scanService.get(identifier, observe);
  }



  /* Resources API end */
  addTargetBibliographicResource(entry: models.BibliographicEntry, resource_id: string): Observable<TypedResourceView> {
    return this.bibliographicEntryService.addTargetBibliographicResource(
      entry._id,
      resource_id
    ).pipe(map( br => new TypedResourceView(br) ));
  }

  removeTargetBibliographicResource(entry: models.BibliographicEntry): Observable<TypedResourceView> {
    return this.bibliographicEntryService.removeTargetBibliographicResource(entry._id).pipe(map( br => new TypedResourceView(br) ));
  }

  async updateTargetResource(
    entry: models.BibliographicEntry,
    resource_id: string ): Promise<models.BibliographicEntry> {
    /* adds or update link from entry to resource
     * 1-2 requests */
    if (entry.references) {
      try {
        await this.removeTargetBibliographicResource(entry).toPromise();
        entry.status = enums.status.ocrProcessed; // back-end does it... TODO FIXME
      } catch (e) {
        console.log('References pointer was invalid. Pass...');
      }
      entry.references = '';
    }
    await this.addTargetBibliographicResource(entry, resource_id).toPromise();
    /* to keep view consistent */
    entry.status = enums.status.valid;
    entry.references = resource_id;
    return Promise.resolve(entry);
  }

  bibliographicResource(identifier: string): Observable<TypedResourceView> {
    return this.bibliographicResourceService.get(identifier)
      .map(br => new TypedResourceView(br))
      .retryWhen(errors => {console.log('[locdbService][Error] retrying');
                            let retries = 0;
                            return errors.delay(750).map(error => {
                            if (retries++ === 5) {
                              throw error;
                            }
                              return error;
                            })});
  }

  parentResource(br: TypedResourceView | models.BibliographicResource): Observable<TypedResourceView> {
    return this.bibliographicResource(br.partOf);
  }

  async safeCommitLink(
    entry: models.BibliographicEntry,
    resources: [TypedResourceView, TypedResourceView]
  ): Promise<[TypedResourceView, TypedResourceView]> {
    /* if necessary, creates target resource before updating the reference of the entry */
    /* 1-3 requests */
    let [child, container] = resources;
    // console.log('Child:', child)
    // console.log('Parent:', container)
    if (container) {
      console.log('Pushing parent:', container)
      container = await this.maybePostResource(container).toPromise();
      child.data.partOf = container._id;
    }
    child = await this.maybePostResource(child).toPromise();
    // console.log('Child after commit, before updating target', child)
    // let target_parent = null
    // if(resources[1] != undefined && resources[1] != null){
    //   let target_resource = resources[1]
    //   target_parent = await this.maybePostResource(target_resource).toPromise();
    // }
    // let target = null
    // if (resources[0] != undefined && resources[0] != null) {
    //   let resource = resources[0];
    //   if (resources[1] != undefined && resources[1] != null) {
    //     resource.data.partOf = resources[1]._id;
    //   }
    //   const target = await this.maybePostResource(resource).toPromise();
    // }
    // console.log('Linking to id', child._id)
    await this.updateTargetResource(entry, child._id);
    return [child, container];
  }

  async safeCreateAndUpdate(
    resources: [TypedResourceView, TypedResourceView]
  ): Promise<[TypedResourceView, TypedResourceView]> {
    /* if necessary, creates target resource before updating the reference of the entry */
    /* 1-3 requests */
    let [child, container] = resources;
    // console.log('Child:', child)
    // console.log('Parent:', container)
    if (container) {
      // console.log('Pushing parent:', container)
      // to update resource in backend if id already existed:
      await this.maybePutResource(container).toPromise();
      // if it is a new parent, let backend assign an id and save it
      container = await this.maybePostResource(container).toPromise();
      child.data.partOf = container._id;
    }
    // to update resource in backend if id already existed:
    await this.maybePutResource(child).toPromise();
    // if it is a new child, let backend assign an id and save it
    child = await this.maybePostResource(child).toPromise();
    // console.log('Child after commit', child)
    return [child, container];
  }

  updateOrCreateResource(resource: TypedResourceView): Observable<TypedResourceView> {
    resource.fixDate(); // sanity
    const data: models.BibliographicResource = <models.BibliographicResource>resource.data;
    if (!resource._id || resource._id === undefined) {
      // Super important
      // otherwise, the migrated resource will appear in ToDo's
      data.status = enums.status.valid;
      return this.bibliographicResourceService.save(data).pipe(map(
        br => new TypedResourceView(br) ));
    } else {
      return this.bibliographicResourceService.update(resource._id, data).pipe(map(
        br => new TypedResourceView(br) ));
    }
  }




  maybePutResource(
    resource: TypedResourceView
  ): Observable<TypedResourceView> {
    /* Update the resource if it is known to the backend
     * 0-1 */
    if (!resource._id || resource._id === undefined) {
      return of(resource);
    } else {
      // TODO FIXME this should not be necessary
      resource.fixDate(); // correct date format if it was set incorrectly
      return this.bibliographicResourceService.update(resource._id,
        <models.BibliographicResource>resource.data).pipe(map( br => new
          TypedResourceView(br) ));
    }
  }

  maybePostResource(tr: TypedResourceView): Observable<TypedResourceView> {
    /* Post the resource if it is not stored in back-end yet
     * 0-1 backend requests */
    if (!tr._id || tr._id === undefined) {
      console.log('Resource has no _id. Inserting it into the backend.', tr);
      // !!! Never ever forget this when on righthand-side, they should never be external
      // 19.03.2018: Dont do this, we would corrupt todo item..
      tr.fixDate(); // correct date format if it was set incorrectly

      // Only external suggestions or manually created resources don't have an Id,
      // so its safe to set it to valid
      tr.status = enums.status.valid;
      return this.bibliographicResourceService.save(<models.BibliographicResource>tr.data).pipe(map( br => new TypedResourceView(br) ));
    } else {
      console.log('Resource has _id. Proceeding...', tr._id);
      return of(tr);
    }
  }

  getBibliographicResource(id: string): Observable<TypedResourceView> {
    // console.log('[locdb.service][debug] get resource: ', id)
    return this.bibliographicResourceService.get(id).map(br => new TypedResourceView(br))
              .retryWhen(errors => {console.log('[locdbService][Error] retrying', id);
                                      let retries = 0;
                                      return errors.delay(750).map(error => {
                                      if (retries++ === 5) {
                                        throw error;
                                      }
                                        return error;
                                      })});
  }

  // DEPRECATED or integrate in Maybe Methods
  putBibliographicResource(resource: TypedResourceView): Observable<TypedResourceView> {
    return this.bibliographicResourceService.update(resource._id,
      <models.BibliographicResource>resource.data).pipe(map( br => new
        TypedResourceView(br)));
  }

  pushBibligraphicResource(resource: TypedResourceView): Observable<TypedResourceView> {
    return this.bibliographicResourceService.save(<models.BibliographicResource>resource.data).pipe(map( br => new TypedResourceView(br)));
  }

  deleteBibliographicResource(resource: TypedResourceView): Observable<models.SuccessResponse> {
    return this.bibliographicResourceService.deleteSingle(resource._id)
      .retryWhen(errors => {console.log('[locdbService][Error] retrying');
                             let retries = 0;
                             return errors.delay(750).map(error => {
                             if (retries++ === 5) {
                               throw error;
                             }
                               return error;})});
  }
  /* Resources API end */

  deleteBibliographicEntry(entry: models.BibliographicEntry): Observable<models.BibliographicEntry> {
    return this.bibliographicEntryService.remove(entry._id)
    .retryWhen(errors => {console.log('[locdbService][Error] retrying');
                           let retries = 0;
                           return errors.delay(750).map(error => {
                           if (retries++ === 5) {
                             throw error;}})});
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
