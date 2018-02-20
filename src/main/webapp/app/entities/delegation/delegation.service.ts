import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { Delegation } from './delegation.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<Delegation>;

@Injectable()
export class DelegationService {

    private resourceUrl =  SERVER_API_URL + 'api/delegations';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/delegations';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }

    create(delegation: Delegation): Observable<EntityResponseType> {
        const copy = this.convert(delegation);
        return this.http.post<Delegation>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(delegation: Delegation): Observable<EntityResponseType> {
        const copy = this.convert(delegation);
        return this.http.put<Delegation>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Delegation>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<Delegation[]>> {
        const options = createRequestOption(req);
        return this.http.get<Delegation[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Delegation[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<Delegation[]>> {
        const options = createRequestOption(req);
        return this.http.get<Delegation[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Delegation[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Delegation = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Delegation[]>): HttpResponse<Delegation[]> {
        const jsonResponse: Delegation[] = res.body;
        const body: Delegation[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Delegation.
     */
    private convertItemFromServer(delegation: Delegation): Delegation {
        const copy: Delegation = Object.assign({}, delegation);
        copy.from = this.dateUtils
            .convertDateTimeFromServer(delegation.from);
        copy.to = this.dateUtils
            .convertDateTimeFromServer(delegation.to);
        copy.createdDate = this.dateUtils
            .convertDateTimeFromServer(delegation.createdDate);
        copy.lastModifiedDate = this.dateUtils
            .convertDateTimeFromServer(delegation.lastModifiedDate);
        return copy;
    }

    /**
     * Convert a Delegation to a JSON which can be sent to the server.
     */
    private convert(delegation: Delegation): Delegation {
        const copy: Delegation = Object.assign({}, delegation);

        copy.from = this.dateUtils.toDate(delegation.from);

        copy.to = this.dateUtils.toDate(delegation.to);

        copy.createdDate = this.dateUtils.toDate(delegation.createdDate);

        copy.lastModifiedDate = this.dateUtils.toDate(delegation.lastModifiedDate);
        return copy;
    }
}
