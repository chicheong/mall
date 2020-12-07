import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption, SearchWithPagination } from 'app/shared/util/request-util';
import { IShippingType } from 'app/shared/model/shipping-type.model';

type EntityResponseType = HttpResponse<IShippingType>;
type EntityArrayResponseType = HttpResponse<IShippingType[]>;

@Injectable({ providedIn: 'root' })
export class ShippingTypeService {
  public resourceUrl = SERVER_API_URL + 'api/shipping-types';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/shipping-types';

  constructor(protected http: HttpClient) {}

  create(shippingType: IShippingType): Observable<EntityResponseType> {
    return this.http.post<IShippingType>(this.resourceUrl, shippingType, { observe: 'response' });
  }

  update(shippingType: IShippingType): Observable<EntityResponseType> {
    return this.http.put<IShippingType>(this.resourceUrl, shippingType, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IShippingType>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IShippingType[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IShippingType[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }
}
