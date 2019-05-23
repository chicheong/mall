import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IQuantity } from 'app/shared/model/quantity.model';

type EntityResponseType = HttpResponse<IQuantity>;
type EntityArrayResponseType = HttpResponse<IQuantity[]>;

@Injectable({ providedIn: 'root' })
export class QuantityService {
    public resourceUrl = SERVER_API_URL + 'api/quantities';
    public resourceSearchUrl = SERVER_API_URL + 'api/_search/quantities';

    constructor(protected http: HttpClient) {}

    create(quantity: IQuantity): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(quantity);
        return this.http
            .post<IQuantity>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(quantity: IQuantity): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(quantity);
        return this.http
            .put<IQuantity>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IQuantity>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IQuantity[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IQuantity[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    protected convertDateFromClient(quantity: IQuantity): IQuantity {
        const copy: IQuantity = Object.assign({}, quantity, {
            from: quantity.from != null && quantity.from.isValid() ? quantity.from.toJSON() : null,
            to: quantity.to != null && quantity.to.isValid() ? quantity.to.toJSON() : null
        });
        return copy;
    }

    protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
        if (res.body) {
            res.body.from = res.body.from != null ? moment(res.body.from) : null;
            res.body.to = res.body.to != null ? moment(res.body.to) : null;
        }
        return res;
    }

    protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        if (res.body) {
            res.body.forEach((quantity: IQuantity) => {
                quantity.from = quantity.from != null ? moment(quantity.from) : null;
                quantity.to = quantity.to != null ? moment(quantity.to) : null;
            });
        }
        return res;
    }
}
