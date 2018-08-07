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

import { Observable }                                        from 'rxjs/Observable';

import { BibliographicResource } from '../model/bibliographicResource';
import { ErrorResponse } from '../model/errorResponse';
import { SuccessResponse } from '../model/successResponse';
import { ToDo } from '../model/toDo';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';


@Injectable()
export class ScanService {

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
     * Returns a single scan by id
     * @param id The internal identifier of the scan
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public get(id: string, observe?: 'body', reportProgress?: boolean): Observable<Blob>;
    public get(id: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Blob>>;
    public get(id: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Blob>>;
    public get(id: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling get.');
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

        return this.httpClient.get(`${this.basePath}/scans/${encodeURIComponent(String(id))}`,
            {
                responseType: "blob",
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * 
     * Retrieves the BRs including their associated parts and scans that are either not processed or processed by the OCR-component or retrieved from external.
     * @param status The list of status for which the ToDo-list shall be retrieved
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getToDo(status: Array<string>, observe?: 'body', reportProgress?: boolean): Observable<Array<ToDo>>;
    public getToDo(status: Array<string>, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<ToDo>>>;
    public getToDo(status: Array<string>, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<ToDo>>>;
    public getToDo(status: Array<string>, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (status === null || status === undefined) {
            throw new Error('Required parameter status was null or undefined when calling getToDo.');
        }

        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (status) {
            queryParameters = queryParameters.set('status', status.join(COLLECTION_FORMATS['csv']));
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

        return this.httpClient.get<Array<ToDo>>(`${this.basePath}/getToDo`,
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
     * Deletes a single scan by id
     * @param id The internal identifier of the scan
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public remove(id: string, observe?: 'body', reportProgress?: boolean): Observable<SuccessResponse>;
    public remove(id: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<SuccessResponse>>;
    public remove(id: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<SuccessResponse>>;
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

        return this.httpClient.delete<SuccessResponse>(`${this.basePath}/scans/${encodeURIComponent(String(id))}`,
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
     * Saves a bibliographic Resource given it&#39;s identifier and resourceType as well as additional information
     * @param identifierScheme The scheme of the identifier of the resource
     * @param identifierLiteralValue The literal value of the identifier of the resource
     * @param resourceType The type of the resource.
     * @param firstPage The number of the first page of the resource (for journal articles, book chapters etc).
     * @param lastPage The number of the last page of the resource.
     * @param textualPdf Whether the references file (if given) is a PDF with textual content
     * @param binaryFile The reference page (binary file)
     * @param stringFile The reference page (string), e.g. the html code of an online reference page
     * @param embodimentType The embodiment type (PRINT or DIGITAL) of the resource
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public saveResource(identifierScheme: string, identifierLiteralValue: string, resourceType: string, firstPage?: number, lastPage?: number, textualPdf?: boolean, binaryFile?: Blob, stringFile?: string, embodimentType?: string, observe?: 'body', reportProgress?: boolean): Observable<BibliographicResource>;
    public saveResource(identifierScheme: string, identifierLiteralValue: string, resourceType: string, firstPage?: number, lastPage?: number, textualPdf?: boolean, binaryFile?: Blob, stringFile?: string, embodimentType?: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<BibliographicResource>>;
    public saveResource(identifierScheme: string, identifierLiteralValue: string, resourceType: string, firstPage?: number, lastPage?: number, textualPdf?: boolean, binaryFile?: Blob, stringFile?: string, embodimentType?: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<BibliographicResource>>;
    public saveResource(identifierScheme: string, identifierLiteralValue: string, resourceType: string, firstPage?: number, lastPage?: number, textualPdf?: boolean, binaryFile?: Blob, stringFile?: string, embodimentType?: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (identifierScheme === null || identifierScheme === undefined) {
            throw new Error('Required parameter identifierScheme was null or undefined when calling saveResource.');
        }
        if (identifierLiteralValue === null || identifierLiteralValue === undefined) {
            throw new Error('Required parameter identifierLiteralValue was null or undefined when calling saveResource.');
        }
        if (resourceType === null || resourceType === undefined) {
            throw new Error('Required parameter resourceType was null or undefined when calling saveResource.');
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

        const canConsumeForm = this.canConsumeForm(consumes);

        let formParams: { append(param: string, value: any): void; };
        let useForm = false;
        let convertFormParamsToString = false;
        // use FormData to transmit files using content-type "multipart/form-data"
        // see https://stackoverflow.com/questions/4007969/application-x-www-form-urlencoded-or-multipart-form-data
        useForm = canConsumeForm;
        if (useForm) {
            formParams = new FormData();
        } else {
            formParams = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        }

        if (identifierScheme !== undefined) {
            formParams = formParams.append('identifierScheme', <any>identifierScheme) || formParams;
        }
        if (identifierLiteralValue !== undefined) {
            formParams = formParams.append('identifierLiteralValue', <any>identifierLiteralValue) || formParams;
        }
        if (firstPage !== undefined) {
            formParams = formParams.append('firstPage', <any>firstPage) || formParams;
        }
        if (lastPage !== undefined) {
            formParams = formParams.append('lastPage', <any>lastPage) || formParams;
        }
        if (textualPdf !== undefined) {
            formParams = formParams.append('textualPdf', <any>textualPdf) || formParams;
        }
        if (binaryFile !== undefined) {
            formParams = formParams.append('binaryFile', <any>binaryFile) || formParams;
        }
        if (stringFile !== undefined) {
            formParams = formParams.append('stringFile', <any>stringFile) || formParams;
        }
        if (embodimentType !== undefined) {
            formParams = formParams.append('embodimentType', <any>embodimentType) || formParams;
        }
        if (resourceType !== undefined) {
            formParams = formParams.append('resourceType', <any>resourceType) || formParams;
        }

        return this.httpClient.post<BibliographicResource>(`${this.basePath}/saveResource`,
            convertFormParamsToString ? formParams.toString() : formParams,
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
     * Send a processing request to the OCR component.
     * @param id The unique id of the scan which should be send to the OCR component
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public triggerOcrProcessing(id: string, observe?: 'body', reportProgress?: boolean): Observable<BibliographicResource>;
    public triggerOcrProcessing(id: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<BibliographicResource>>;
    public triggerOcrProcessing(id: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<BibliographicResource>>;
    public triggerOcrProcessing(id: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling triggerOcrProcessing.');
        }

        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (id !== undefined) {
            queryParameters = queryParameters.set('id', <any>id);
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

        return this.httpClient.get<BibliographicResource>(`${this.basePath}/triggerOcrProcessing`,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}