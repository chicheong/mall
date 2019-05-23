import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IUrl } from 'app/shared/model/url.model';

type EntityResponseType = HttpResponse<IUrl>;
type EntityArrayResponseType = HttpResponse<IUrl[]>;

@Injectable({ providedIn: 'root' })
export class UrlService {
    public resourceUrl = SERVER_API_URL + 'api/urls';
    public resourceSearchUrl = SERVER_API_URL + 'api/_search/urls';

    constructor(protected http: HttpClient) {}

    create(url: IUrl): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(url);
        return this.http
            .post<IUrl>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(url: IUrl): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(url);
        return this.http
            .put<IUrl>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IUrl>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IUrl[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IUrl[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    protected convertDateFromClient(url: IUrl): IUrl {
        const copy: IUrl = Object.assign({}, url, {
            createdDate: url.createdDate != null && url.createdDate.isValid() ? url.createdDate.toJSON() : null,
            lastModifiedDate: url.lastModifiedDate != null && url.lastModifiedDate.isValid() ? url.lastModifiedDate.toJSON() : null
        });
        return copy;
    }

    protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
        if (res.body) {
            res.body.createdDate = res.body.createdDate != null ? moment(res.body.createdDate) : null;
            res.body.lastModifiedDate = res.body.lastModifiedDate != null ? moment(res.body.lastModifiedDate) : null;
        }
        return res;
    }

    protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        if (res.body) {
            res.body.forEach((url: IUrl) => {
                url.createdDate = url.createdDate != null ? moment(url.createdDate) : null;
                url.lastModifiedDate = url.lastModifiedDate != null ? moment(url.lastModifiedDate) : null;
            });
        }
        return res;
    }
}
