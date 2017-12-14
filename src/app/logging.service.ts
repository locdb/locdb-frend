import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from 'environments/environment';

import { BibliographicEntry, BibliographicResource } from './locdb';

@Injectable()
export class LoggingService {
  private url_ = `${environment.locdbUrl}/log`;

  constructor(http: Http) {

  }


  /* Rationale: always log entry ID so that events can be grouped together more easily */


  logReferenceSelected(entry: BibliographicEntry) {
    const logobject = { msg: 'REFERENCE SELECTED', id: entry._id };
    console.log(logobject);
  }

  logSearchIssued(entry: BibliographicEntry, queryString: string, confidences_values: [number, number]) {
    const logobject = {
      msg: 'SEARCH ISSUED',
      id: entry._id,
      queryString: queryString,
      confidences_values: confidences_values
    };
    console.log(logobject);

  }


  logSuggestionsArrived(entry: BibliographicEntry, sugs: BibliographicResource[], internal) {
    const logobject = {
      msg: 'SUGGESTIONS ARRIVED',
      id: entry._id,
      internal: internal,
      n_suggestions: sugs.length,
    };
    console.log(logobject);

  }


  logCommitPressed(entry: BibliographicEntry, target: BibliographicResource, from_where: 'INTERNAL' | 'EXTERNAL' | 'OCR') {
    const logobject = {
      msg: 'COMMIT PRESSED',
      id: entry._id,
      target: target._id,
      from_where: from_where
    };
    console.log(logobject);

  }



}
