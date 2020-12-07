import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption, SearchWithPagination } from 'app/shared/util/request-util';
import { IMyUrl } from 'app/shared/model/my-url.model';

type EntityResponseType = HttpResponse<IMyUrl>;
type EntityArrayResponseType = HttpResponse<IMyUrl[]>;

@Injectable({ providedIn: 'root' })
export class MyUrlService {
  public resourceUrl = SERVER_API_URL + 'api/urls';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/urls';

  constructor(protected http: HttpClient) {}

  create(url: IMyUrl): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(url);
    return this.http
      .post<IMyUrl>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  createMultiple(urls: IMyUrl[]): Observable<HttpResponse<IMyUrl[]>> {
      const copies: IMyUrl[] = [];
//      urls.forEach(url => {
//          copies.push(this.convert(url));
//      });
      return this.http.post<IMyUrl[]>(this.resourceUrl + '/multiple', copies, { observe: 'response' })
          .pipe(map((res: HttpResponse<IMyUrl[]>) => this.convertDateArrayFromServer(res)));
  }
  
  update(url: IMyUrl): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(url);
    return this.http
      .put<IMyUrl>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IMyUrl>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IMyUrl[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IMyUrl[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  protected convertDateFromClient(url: IMyUrl): IMyUrl {
    const copy: IMyUrl = Object.assign({}, url, {
      createdDate: url.createdDate && url.createdDate.isValid() ? url.createdDate.toJSON() : undefined,
      lastModifiedDate: url.lastModifiedDate && url.lastModifiedDate.isValid() ? url.lastModifiedDate.toJSON() : undefined
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.createdDate = res.body.createdDate ? moment(res.body.createdDate) : undefined;
      res.body.lastModifiedDate = res.body.lastModifiedDate ? moment(res.body.lastModifiedDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((url: IMyUrl) => {
        url.createdDate = url.createdDate ? moment(url.createdDate) : undefined;
        url.lastModifiedDate = url.lastModifiedDate ? moment(url.lastModifiedDate) : undefined;
      });
    }
    return res;
  }
}
