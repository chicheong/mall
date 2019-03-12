import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { Url } from './url.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<Url>;

@Injectable()
export class UrlService {

    private resourceUrl =  SERVER_API_URL + 'api/urls';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/urls';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }

    create(url: Url): Observable<EntityResponseType> {
        const copy = this.convert(url);
        return this.http.post<Url>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    createMultiple(urls: Url[]): Observable<HttpResponse<Url[]>> {
        const copies: Url[] = [];
        urls.forEach((url) => {
            copies.push(this.convert(url));
        });
        return this.http.post<Url[]>(this.resourceUrl + '/multiple', copies, { observe: 'response' })
            .map((res: HttpResponse<Url[]>) => this.convertArrayResponse(res));
    }

    update(url: Url): Observable<EntityResponseType> {
        const copy = this.convert(url);
        return this.http.put<Url>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Url>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<Url[]>> {
        const options = createRequestOption(req);
        return this.http.get<Url[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Url[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<Url[]>> {
        const options = createRequestOption(req);
        return this.http.get<Url[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Url[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Url = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Url[]>): HttpResponse<Url[]> {
        const jsonResponse: Url[] = res.body;
        const body: Url[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Url.
     */
    private convertItemFromServer(url: Url): Url {
        const copy: Url = Object.assign({}, url);
        copy.createdDate = this.dateUtils
            .convertDateTimeFromServer(url.createdDate);
        copy.lastModifiedDate = this.dateUtils
            .convertDateTimeFromServer(url.lastModifiedDate);
        return copy;
    }

    /**
     * Convert a Url to a JSON which can be sent to the server.
     */
    private convert(url: Url): Url {
        const copy: Url = Object.assign({}, url);

        copy.createdDate = this.dateUtils.toDate(url.createdDate);

        copy.lastModifiedDate = this.dateUtils.toDate(url.lastModifiedDate);
        return copy;
    }
}
