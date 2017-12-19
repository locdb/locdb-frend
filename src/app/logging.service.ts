import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';

import { BibliographicEntry, BibliographicResource, ProvenResource, Origin } from './locdb';


import {Observable} from 'rxjs/Rx';

@Injectable()
export class LoggingService {
  private http: any;
  private _augmentFunctions = <any>[];
  private url_ = `${environment.locdbUrl}/log`;
  private log_active = true

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


  logReferenceTargetSelected(entry: BibliographicEntry, selectedRessource: BibliographicResource) {
    const logobject = { msg: 'REFERENCE TARGET SELECTED', title: selectedRessource.title,
    root_resource_id: entry._id, current_selected_ids: selectedRessource.identifiers };
    console.log(logobject);
    if(this.log_active){
      this.sendLog(logobject);}
  }

  logReferenceSelected(selectedEntry: BibliographicEntry) {
    const logobject = { msg: 'REFERENCE SELECTED',
     current_selected_id: selectedEntry._id };
    console.log(logobject);
    if(this.log_active){
      this.sendLog(logobject);}
  }

  logSearchIssued(entry: BibliographicEntry, selectedRessource: BibliographicResource, queryString: string, confidences_values: any){//}[number, number]) {
    if (selectedRessource){
      const logobject = {
        msg: 'SEARCH ISSUED',
        root_resource_id: entry._id,
        current_selected_ids: selectedRessource.identifiers,
        queryString: queryString,
        confidences_values: confidences_values
      };
      console.log(logobject);
      if(this.log_active){
        this.sendLog(logobject);}
    }
    else{
      const logobject = {
        msg: 'SEARCH ISSUED',
        root_resource_id: entry._id,
        current_selected_ids: 'undefined',
        queryString: queryString,
        confidences_values: confidences_values
      };
      console.log(logobject);
      if(this.log_active){
        this.sendLog(logobject);}
    }

  }

  logSuggestionsArrived(entry: BibliographicEntry, sugs: ProvenResource | BibliographicResource[], internal) {
    if(!(sugs instanceof ProvenResource) && sugs.length>0){
      const logobject = {
        msg: 'SUGGESTIONS ARRIVED',
        root_resource_id: entry._id,
        internal: internal,
        n_suggestions: sugs.length,
      };
      console.log(logobject);
      if(this.log_active){
        this.sendLog(logobject);}

    }
    else{
      const logobject = {
        msg: 'SUGGESTIONS ARRIVED',
        root_resource_id: entry._id,
        internal: internal,
        n_suggestions: 0,
      };
      console.log(logobject);
      if(this.log_active){
        this.sendLog(logobject);}
    }

  }


  logCommitPressed(entry: BibliographicEntry, target: BibliographicResource, from_where: Origin) {
    const logobject = {
      msg: 'COMMIT PRESSED',
      root_ressource_id: entry._id,
      target: target._id,
      from_where: from_where
    };
    console.log(logobject);
    if(this.log_active){
      this.sendLog(logobject);}

  }

  logStartEditing(resource: BibliographicResource | ProvenResource, from_where?: Origin) {
    const logobject = {
      msg: 'START EDITING',
      id: resource.identifiers,
      title: resource.title,
      // target: BibliographicResource,
      from_where: from_where
    };
    console.log(logobject);
    if(this.log_active){
      this.sendLog(logobject);}

  }
  logEndEditing(resource: BibliographicResource | ProvenResource, from_where?: Origin) {
    const logobject = {
      msg: 'STOP EDITING',
      id: resource.identifiers,
      title: resource.title,
      // target: BibliographicResource,
      from_where: from_where
    };
    console.log(logobject);
    if(this.log_active){
      this.sendLog(logobject);}

  }

  sendLog(logObject:any): Observable<any> {
    console.log("send log")
    let body = JSON.stringify(logObject);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    console.log(body,headers,options)
    return this.http.post(this.url_, body, options)
        .map(this.extractData)
        .catch(this.handleError);
    }

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


}
