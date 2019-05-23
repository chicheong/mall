import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IDelegation } from 'app/shared/model/delegation.model';

type EntityResponseType = HttpResponse<IDelegation>;
type EntityArrayResponseType = HttpResponse<IDelegation[]>;

@Injectable({ providedIn: 'root' })
export class DelegationService {
    public resourceUrl = SERVER_API_URL + 'api/delegations';
    public resourceSearchUrl = SERVER_API_URL + 'api/_search/delegations';

    constructor(protected http: HttpClient) {}

    create(delegation: IDelegation): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(delegation);
        return this.http
            .post<IDelegation>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(delegation: IDelegation): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(delegation);
        return this.http
            .put<IDelegation>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IDelegation>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IDelegation[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IDelegation[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    protected convertDateFromClient(delegation: IDelegation): IDelegation {
        const copy: IDelegation = Object.assign({}, delegation, {
            from: delegation.from != null && delegation.from.isValid() ? delegation.from.toJSON() : null,
            to: delegation.to != null && delegation.to.isValid() ? delegation.to.toJSON() : null,
            createdDate: delegation.createdDate != null && delegation.createdDate.isValid() ? delegation.createdDate.toJSON() : null,
            lastModifiedDate:
                delegation.lastModifiedDate != null && delegation.lastModifiedDate.isValid() ? delegation.lastModifiedDate.toJSON() : null
        });
        return copy;
    }

    protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
        if (res.body) {
            res.body.from = res.body.from != null ? moment(res.body.from) : null;
            res.body.to = res.body.to != null ? moment(res.body.to) : null;
            res.body.createdDate = res.body.createdDate != null ? moment(res.body.createdDate) : null;
            res.body.lastModifiedDate = res.body.lastModifiedDate != null ? moment(res.body.lastModifiedDate) : null;
        }
        return res;
    }

    protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        if (res.body) {
            res.body.forEach((delegation: IDelegation) => {
                delegation.from = delegation.from != null ? moment(delegation.from) : null;
                delegation.to = delegation.to != null ? moment(delegation.to) : null;
                delegation.createdDate = delegation.createdDate != null ? moment(delegation.createdDate) : null;
                delegation.lastModifiedDate = delegation.lastModifiedDate != null ? moment(delegation.lastModifiedDate) : null;
            });
        }
        return res;
    }
}
