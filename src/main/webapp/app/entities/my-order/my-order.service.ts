import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption, SearchWithPagination } from 'app/shared/util/request-util';
import { IMyOrder } from 'app/shared/model/my-order.model';
import { isNumber } from "util";
import { IProductItem } from "app/shared/model/product-item.model";
import { IOrderItem } from "app/shared/model/order-item.model";

type EntityResponseType = HttpResponse<IMyOrder>;
type EntityArrayResponseType = HttpResponse<IMyOrder[]>;

@Injectable({ providedIn: 'root' })
export class MyOrderService {
  public resourceUrl = SERVER_API_URL + 'api/my-orders';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/my-orders';
  private resourceCartUrl = SERVER_API_URL + 'api/my-cart';

  constructor(protected http: HttpClient) {}

  create(myOrder: IMyOrder): Observable<EntityResponseType> {
    return this.http.post<IMyOrder>(this.resourceUrl, myOrder, { observe: 'response' });
  }

  update(myOrder: IMyOrder): Observable<EntityResponseType> {
    return this.http.put<IMyOrder>(this.resourceUrl, myOrder, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMyOrder>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMyOrder[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMyOrder[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }
  
  addToCart(productItem: IProductItem | undefined, quantity: number): Observable<HttpResponse<IMyOrder>> {
      const copy: IProductItem = Object.assign({}, productItem);
      const orderItem: IOrderItem = Object.assign({});
      orderItem.productItem = copy;
      orderItem.quantity = quantity;
      orderItem.currency = copy.currency;
//      console.error('copy.currency: ' + copy.currency);
      orderItem.price = copy.price;
      return this.http.post<IMyOrder>(this.resourceCartUrl, orderItem, { observe: 'response' });
  }

  calculateTotalQuantity(myOrder: IMyOrder, checkedOnly: boolean): number {
      let total = 0;
      if (myOrder.shops) {
          myOrder.shops.forEach(shop => {
//             console.error('my-order-service->calculateTotalQuantity->shop.items: ' + shop.items);
             if (shop.items) {
                 shop.items.forEach(item => {
                     if (item){
                         if (checkedOnly) {
                             if (item.isChecked) {
                                 total += isNumber(item.quantity)?item.quantity:0;
                             }
                         } else {
                             total += isNumber(item.quantity)?item.quantity:0; // item!.quantity;
                         }
                     }
                 });
             }
          });
      }
      return total;
  }
}
