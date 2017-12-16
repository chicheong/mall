import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { Delegation } from './delegation.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class DelegationService {

    private resourceUrl = SERVER_API_URL + 'api/delegations';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/delegations';

    constructor(private http: Http, private dateUtils: JhiDateUtils) { }

    create(delegation: Delegation): Observable<Delegation> {
        const copy = this.convert(delegation);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(delegation: Delegation): Observable<Delegation> {
        const copy = this.convert(delegation);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: number): Observable<Delegation> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceUrl, options)
            .map((res: Response) => this.convertResponse(res));
    }

    delete(id: number): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${id}`);
    }

    search(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceSearchUrl, options)
            .map((res: any) => this.convertResponse(res));
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        const result = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            result.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return new ResponseWrapper(res.headers, result, res.status);
    }

    /**
     * Convert a returned JSON object to Delegation.
     */
    private convertItemFromServer(json: any): Delegation {
        const entity: Delegation = Object.assign(new Delegation(), json);
        entity.from = this.dateUtils
            .convertDateTimeFromServer(json.from);
        entity.to = this.dateUtils
            .convertDateTimeFromServer(json.to);
        entity.createdDate = this.dateUtils
            .convertDateTimeFromServer(json.createdDate);
        entity.lastModifiedDate = this.dateUtils
            .convertDateTimeFromServer(json.lastModifiedDate);
        return entity;
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
