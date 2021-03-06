
import {throwError as observableThrowError} from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';

import { models, TypedResourceView, Provenance } from './locdb';


import {Observable} from 'rxjs/Rx';

@Injectable()
export class LoggingService {
  private http: any;
  private _augmentFunctions = <any>[];
  private url_ = `${environment.locdbUrl}/log`;
  private log_active = environment.production;

  constructor(http: Http) {
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


  /* Rationale: always log entry ID so that events can be grouped together more easily */

  logReferenceTargetSelected(entry: models.BibliographicEntry, selectedRessource: TypedResourceView) {
    const logobject = {
      msg: 'REFERENCE TARGET SELECTED',
      title: selectedRessource.title,
      entry_id: entry._id,
      current_selected_ids: selectedRessource.identifiers
    };
    this.sendLog(logobject);
  }

  logReferenceSelected(selectedEntry: models.BibliographicEntry) {
    const logobject = { msg: 'REFERENCE SELECTED',
     current_selected_id: selectedEntry._id };
    this.sendLog(logobject);
  }

  logSearchIssued(entry: models.BibliographicEntry, selectedRessource:
    TypedResourceView, queryString: string, confidences_values:
    any) {
    if (selectedRessource) {
      const logobject = {
        msg: 'SEARCH ISSUED',
        entry_id: entry._id,
        current_selected_ids: selectedRessource.identifiers,
        queryString: queryString,
        confidences_values: confidences_values
      };
      this.sendLog(logobject);
    } else {
      const logobject = {
        msg: 'SEARCH ISSUED',
        entry_id: entry._id,
        current_selected_ids: 'undefined',
        queryString: queryString,
        confidences_values: confidences_values
      };
      this.sendLog(logobject);
    }
  }

  logSuggestionsArrived(entry: models.BibliographicEntry, howmany: number, internal: boolean) {
      const logobject = {
        msg: 'SUGGESTIONS ARRIVED',
        entry_id: entry._id,
        internal: internal,
        n_suggestions: howmany,
      };
    this.sendLog(logobject);
  }


  logCommitPressed(entry: models.BibliographicEntry, target: TypedResourceView, from_where: Provenance) {
    const logobject = {
      msg: 'COMMIT PRESSED',
      entry_id: entry._id,
      target: target._id,
      from_where: from_where
    };
    this.sendLog(logobject);

  }

  logCommited(entry: models.BibliographicEntry, newtarget: TypedResourceView, from_where: Provenance) {
    const logobject = {
      msg: 'COMMIT SUCCEEDED',
      entry_id: entry._id,
      newtarget: newtarget._id,
      from_where: from_where
    };
    this.sendLog(logobject);
  }

  logStartEditing(resource: TypedResourceView, from_where?: Provenance) {
    const logobject = {
      msg: 'START EDITING',
      resource_id: resource._id,
      title: resource.title,
      // target: BibliographicResource,
      from_where: from_where
    };
    this.sendLog(logobject);

  }
  logEndEditing(resource: TypedResourceView, from_where?: Provenance) {
    const logobject = {
      msg: 'STOP EDITING',
      resource_id: resource._id,
      title: resource.title,
      // target: BibliographicResource,
      from_where: from_where
    };
    this.sendLog(logobject);
  }

  logAskOthersPressed(entry: models.BibliographicEntry, query: String) {
    const logobject = {
      msg: 'ASK OTHERS CLICKED',
      entry_id: entry._id,
      query: query
    };
    this.sendLog(logobject);
  }

  sendLog(logobject: any) {
    // always log to console
    // console.log(logobject);
    // only log if active
    if (this.log_active) {
      this.uploadLog(logobject).subscribe(
        (res) => {console.log('Success:', res)},
        (err) => {console.log('Error:', err)}
      );
    }
  }

  uploadLog(logObject: any): Observable<any> {
    // console.log('Uploading Log Object')
    const body = JSON.stringify(logObject);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });

    // console.log(body, headers, options)
    return this.http.post(this.url_, body, options)
    .map(this.extractData)
    .catch(this.handleError);
  }

  private extractData(res: Response) {
    // console.log('Response', res);
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
    return observableThrowError(errMsg);
  }


}
