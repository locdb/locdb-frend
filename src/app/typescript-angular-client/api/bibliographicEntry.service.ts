/**
 * LOC-DB Central Component
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 0.0.1
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
/* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional }                      from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams,
         HttpResponse, HttpEvent }                           from '@angular/common/http';
import { CustomHttpUrlEncodingCodec }                        from '../encoder';

import { Observable }                                        from 'rxjs';

import { BibliographicEntry } from '../model/bibliographicEntry';
import { BibliographicResource } from '../model/bibliographicResource';
import { ErrorResponse } from '../model/errorResponse';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';


@Injectable()
export class BibliographicEntryService {

    protected basePath = 'https://localhost';
    public defaultHeaders = new HttpHeaders();
    public configuration = new Configuration();

    constructor(protected httpClient: HttpClient, @Optional()@Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration) {
        if (basePath) {
            this.basePath = basePath;
        }
        if (configuration) {
            this.configuration = configuration;
            this.basePath = basePath || configuration.basePath || this.basePath;
        }
    }

    /**
     * @param consumes string[] mime-types
     * @return true: consumes contains 'multipart/form-data', false: otherwise
     */
    private canConsumeForm(consumes: string[]): boolean {
        const form = 'multipart/form-data';
        for (let consume of consumes) {
            if (form === consume) {
                return true;
            }
        }
        return false;
    }


    /**
     * 
     * Given the _id of a bibliographic entry and the _id of a target, i.e., a cited, bibliographic resource, this service takes care of setting all related properties in a consistent way. More precisely, the following three things happen: 1) The &#39;status&#39; of the bibliographic entry will be changed to VALID 2) The &#39;references&#39; property of the bibliographic entry will be set to the _id of the target bibliographic resource 3) The &#39;cites&#39; property of the parent resource of the entry will be extended with the _id of the target bibliographic reource 
     * @param bibliographicEntryId The _id of the subject bibliographic entry that should point to the target bibliographic resource
     * @param bibliographicResourceId The _id of the target bibliographic resource which the bibliographic entry should point to
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public addTargetBibliographicResource(bibliographicEntryId: string, bibliographicResourceId: string, observe?: 'body', reportProgress?: boolean): Observable<BibliographicResource>;
    public addTargetBibliographicResource(bibliographicEntryId: string, bibliographicResourceId: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<BibliographicResource>>;
    public addTargetBibliographicResource(bibliographicEntryId: string, bibliographicResourceId: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<BibliographicResource>>;
    public addTargetBibliographicResource(bibliographicEntryId: string, bibliographicResourceId: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (bibliographicEntryId === null || bibliographicEntryId === undefined) {
            throw new Error('Required parameter bibliographicEntryId was null or undefined when calling addTargetBibliographicResource.');
        }
        if (bibliographicResourceId === null || bibliographicResourceId === undefined) {
            throw new Error('Required parameter bibliographicResourceId was null or undefined when calling addTargetBibliographicResource.');
        }

        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (bibliographicEntryId !== undefined) {
            queryParameters = queryParameters.set('bibliographicEntryId', <any>bibliographicEntryId);
        }
        if (bibliographicResourceId !== undefined) {
            queryParameters = queryParameters.set('bibliographicResourceId', <any>bibliographicResourceId);
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json',
            'image/png',
            'application/pdf'
        ];
        let httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set("Accept", httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        let consumes: string[] = [
            'application/json',
            'multipart/form-data'
        ];

        return this.httpClient.get<BibliographicResource>(`${this.basePath}/addTargetBibliographicResource`,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * 
     * creates a bibliographic entry for the given bibliographic resource
     * @param bibliographicResourceId The _id of the bibliographic resource to which the new bibliographic entry should be appended
     * @param bibliographicEntry A bibliographic entry which should be saved
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public create(bibliographicResourceId: string, bibliographicEntry: BibliographicEntry, observe?: 'body', reportProgress?: boolean): Observable<BibliographicEntry>;
    public create(bibliographicResourceId: string, bibliographicEntry: BibliographicEntry, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<BibliographicEntry>>;
    public create(bibliographicResourceId: string, bibliographicEntry: BibliographicEntry, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<BibliographicEntry>>;
    public create(bibliographicResourceId: string, bibliographicEntry: BibliographicEntry, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (bibliographicResourceId === null || bibliographicResourceId === undefined) {
            throw new Error('Required parameter bibliographicResourceId was null or undefined when calling create.');
        }
        if (bibliographicEntry === null || bibliographicEntry === undefined) {
            throw new Error('Required parameter bibliographicEntry was null or undefined when calling create.');
        }

        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (bibliographicResourceId !== undefined) {
            queryParameters = queryParameters.set('bibliographicResourceId', <any>bibliographicResourceId);
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json',
            'image/png',
            'application/pdf'
        ];
        let httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set("Accept", httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        let consumes: string[] = [
            'application/json',
            'multipart/form-data'
        ];
        let httpContentTypeSelected:string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set("Content-Type", httpContentTypeSelected);
        }

        return this.httpClient.post<BibliographicEntry>(`${this.basePath}/bibliographicEntries`,
            bibliographicEntry,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * 
     * Retrieves external br suggestions for a given query string related to a bibliographic entry.
     * @param query The query string for which the suggestions shall be retrieved
     * @param threshold The sring similarity (dice coefficient) between the query string and the title + subtile + contributors above which suggestions shall be retrieved
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getExternalSuggestionsByQueryString(query: string, threshold?: number, observe?: 'body', reportProgress?: boolean): Observable<Array<Array<BibliographicResource>>>;
    public getExternalSuggestionsByQueryString(query: string, threshold?: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<Array<BibliographicResource>>>>;
    public getExternalSuggestionsByQueryString(query: string, threshold?: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<Array<BibliographicResource>>>>;
    public getExternalSuggestionsByQueryString(query: string, threshold?: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (query === null || query === undefined) {
            throw new Error('Required parameter query was null or undefined when calling getExternalSuggestionsByQueryString.');
        }

        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (query !== undefined) {
            queryParameters = queryParameters.set('query', <any>query);
        }
        if (threshold !== undefined) {
            queryParameters = queryParameters.set('threshold', <any>threshold);
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json',
            'image/png',
            'application/pdf'
        ];
        let httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set("Accept", httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        let consumes: string[] = [
            'application/json',
            'multipart/form-data'
        ];

        return this.httpClient.get<Array<Array<BibliographicResource>>>(`${this.basePath}/getExternalSuggestionsByQueryString`,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * 
     * Retrieves internal br suggestions for a given query string related to a bibliographic entry.
     * @param query The query string for which the suggestions shall be retrieved
     * @param threshold The elastic relevance score for above which entrys shall be retrieved
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getInternalSuggestionsByQueryString(query: string, threshold?: number, observe?: 'body', reportProgress?: boolean): Observable<Array<Array<BibliographicResource>>>;
    public getInternalSuggestionsByQueryString(query: string, threshold?: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<Array<BibliographicResource>>>>;
    public getInternalSuggestionsByQueryString(query: string, threshold?: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<Array<BibliographicResource>>>>;
    public getInternalSuggestionsByQueryString(query: string, threshold?: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (query === null || query === undefined) {
            throw new Error('Required parameter query was null or undefined when calling getInternalSuggestionsByQueryString.');
        }

        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (query !== undefined) {
            queryParameters = queryParameters.set('query', <any>query);
        }
        if (threshold !== undefined) {
            queryParameters = queryParameters.set('threshold', <any>threshold);
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json',
            'image/png',
            'application/pdf'
        ];
        let httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set("Accept", httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        let consumes: string[] = [
            'application/json',
            'multipart/form-data'
        ];

        return this.httpClient.get<Array<Array<BibliographicResource>>>(`${this.basePath}/getInternalSuggestionsByQueryString`,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * 
     * Retrieves the BEs that are not processed by a librarian yet.
     * @param scanId The Id of the Scan for which the BEs shall be retrieved
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getToDoBibliographicEntries(scanId?: string, observe?: 'body', reportProgress?: boolean): Observable<Array<BibliographicEntry>>;
    public getToDoBibliographicEntries(scanId?: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<BibliographicEntry>>>;
    public getToDoBibliographicEntries(scanId?: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<BibliographicEntry>>>;
    public getToDoBibliographicEntries(scanId?: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (scanId !== undefined) {
            queryParameters = queryParameters.set('scanId', <any>scanId);
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json',
            'image/png',
            'application/pdf'
        ];
        let httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set("Accept", httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        let consumes: string[] = [
            'application/json',
            'multipart/form-data'
        ];

        return this.httpClient.get<Array<BibliographicEntry>>(`${this.basePath}/getToDoBibliographicEntries`,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * 
     * Deletes a given bibliographic entry by id.
     * @param id The _id of the bibliographic entry to be deleted.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public remove(id: string, observe?: 'body', reportProgress?: boolean): Observable<BibliographicEntry>;
    public remove(id: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<BibliographicEntry>>;
    public remove(id: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<BibliographicEntry>>;
    public remove(id: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling remove.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json',
            'image/png',
            'application/pdf'
        ];
        let httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set("Accept", httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        let consumes: string[] = [
            'application/json',
            'multipart/form-data'
        ];

        return this.httpClient.delete<BibliographicEntry>(`${this.basePath}/bibliographicEntries/${encodeURIComponent(String(id))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * 
     * Given the _id of a bibliographic entry this service clears all properties related to a potential target resource in a consistent way. More precisely, the following three things happen: 1) The &#39;references&#39; property of the bibliographic entry will be cleared 2) The _id of the old target resource will be removed from teh &#39;cites&#39; property of the parent resource of the entry 3) The &#39;status&#39; of the bibliographic entry will be changed to OCR_PROCESSED --&gt; Is this always ok? Note that the old target bibliographic resource will not be deleted. 
     * @param bibliographicEntryId The _id of the subject bibliographic entry that should point to the target bibliographic resource
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public removeTargetBibliographicResource(bibliographicEntryId: string, observe?: 'body', reportProgress?: boolean): Observable<BibliographicResource>;
    public removeTargetBibliographicResource(bibliographicEntryId: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<BibliographicResource>>;
    public removeTargetBibliographicResource(bibliographicEntryId: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<BibliographicResource>>;
    public removeTargetBibliographicResource(bibliographicEntryId: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (bibliographicEntryId === null || bibliographicEntryId === undefined) {
            throw new Error('Required parameter bibliographicEntryId was null or undefined when calling removeTargetBibliographicResource.');
        }

        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (bibliographicEntryId !== undefined) {
            queryParameters = queryParameters.set('bibliographicEntryId', <any>bibliographicEntryId);
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json',
            'image/png',
            'application/pdf'
        ];
        let httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set("Accept", httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        let consumes: string[] = [
            'application/json',
            'multipart/form-data'
        ];

        return this.httpClient.get<BibliographicResource>(`${this.basePath}/removeTargetBibliographicResource`,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * 
     * Updates a given bibliographic entry by id. Note that the status needs to be changed to VALID if this service is called after validation by a librarian. Properties that are not given with the update data are preserved.
     * @param id The _id of the bibliographic entry to be updated.
     * @param bibliographicEntry A bibliographic entry with new values to be updated.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public update(id: string, bibliographicEntry: BibliographicEntry, observe?: 'body', reportProgress?: boolean): Observable<BibliographicEntry>;
    public update(id: string, bibliographicEntry: BibliographicEntry, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<BibliographicEntry>>;
    public update(id: string, bibliographicEntry: BibliographicEntry, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<BibliographicEntry>>;
    public update(id: string, bibliographicEntry: BibliographicEntry, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling update.');
        }
        if (bibliographicEntry === null || bibliographicEntry === undefined) {
            throw new Error('Required parameter bibliographicEntry was null or undefined when calling update.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json',
            'image/png',
            'application/pdf'
        ];
        let httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set("Accept", httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        let consumes: string[] = [
            'application/json',
            'multipart/form-data'
        ];
        let httpContentTypeSelected:string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set("Content-Type", httpContentTypeSelected);
        }

        return this.httpClient.put<BibliographicEntry>(`${this.basePath}/bibliographicEntries/${encodeURIComponent(String(id))}`,
            bibliographicEntry,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}
