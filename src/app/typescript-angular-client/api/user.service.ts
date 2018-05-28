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

import { ErrorResponse } from '../model/errorResponse';
import { Feed } from '../model/feed';
import { FeedEntry } from '../model/feedEntry';
import { SuccessResponse } from '../model/successResponse';
import { User } from '../model/user';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';


@Injectable()
export class UserService {

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
     * Adds an RSS or Atom Feed the users feed list
     * @param feed The feed object consisting of name (may be user specified) and URL of the feed
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public addFeed(feed: Feed, observe?: 'body', reportProgress?: boolean): Observable<User>;
    public addFeed(feed: Feed, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<User>>;
    public addFeed(feed: Feed, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<User>>;
    public addFeed(feed: Feed, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (feed === null || feed === undefined) {
            throw new Error('Required parameter feed was null or undefined when calling addFeed.');
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

        return this.httpClient.post<User>(`${this.basePath}/addFeed`,
            feed,
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
     * Deletes an RSS or Atom Feed from the users feed list
     * @param id The id of the feed to be deleted from the users feed list
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public deleteFeed(id: string, observe?: 'body', reportProgress?: boolean): Observable<User>;
    public deleteFeed(id: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<User>>;
    public deleteFeed(id: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<User>>;
    public deleteFeed(id: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling deleteFeed.');
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

        return this.httpClient.delete<User>(`${this.basePath}/deleteFeed/${encodeURIComponent(String(id))}`,
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
     * Fetches all the feeds entries a user subscribed to
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public fetchFeeds(observe?: 'body', reportProgress?: boolean): Observable<Array<Array<FeedEntry>>>;
    public fetchFeeds(observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<Array<FeedEntry>>>>;
    public fetchFeeds(observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<Array<FeedEntry>>>>;
    public fetchFeeds(observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

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

        return this.httpClient.get<Array<Array<FeedEntry>>>(`${this.basePath}/fetchFeeds`,
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
     * Login service
     * @param user The user object consisting of username and password
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public login(user: User, observe?: 'body', reportProgress?: boolean): Observable<User>;
    public login(user: User, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<User>>;
    public login(user: User, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<User>>;
    public login(user: User, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (user === null || user === undefined) {
            throw new Error('Required parameter user was null or undefined when calling login.');
        }

        let headers = this.defaultHeaders;

        // authentication (login) required
        if (this.configuration.username || this.configuration.password) {
            headers = headers.set('Authorization', 'Basic ' + btoa(this.configuration.username + ':' + this.configuration.password));
        }

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

        return this.httpClient.post<User>(`${this.basePath}/login`,
            user,
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
     * Logout service
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public logout(observe?: 'body', reportProgress?: boolean): Observable<SuccessResponse>;
    public logout(observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<SuccessResponse>>;
    public logout(observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<SuccessResponse>>;
    public logout(observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

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

        return this.httpClient.get<SuccessResponse>(`${this.basePath}/logout`,
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
     * Signup service
     * @param user The user object consisting of username and password
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public signup(user: User, observe?: 'body', reportProgress?: boolean): Observable<User>;
    public signup(user: User, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<User>>;
    public signup(user: User, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<User>>;
    public signup(user: User, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (user === null || user === undefined) {
            throw new Error('Required parameter user was null or undefined when calling signup.');
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

        return this.httpClient.post<User>(`${this.basePath}/signup`,
            user,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}
