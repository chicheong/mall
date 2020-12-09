import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption, SearchWithPagination } from 'app/shared/util/request-util';
import { IMyOrder, PaypalOrderItem, MyOrder } from 'app/shared/model/my-order.model';
import { isNumber } from "util";
import { IProductItem } from "app/shared/model/product-item.model";
import { OrderShop, IOrderShop } from 'app/shared/model/order-shop.model';
import { IOrderItem } from 'app/shared/model/order-item.model';
import { Router } from "@angular/router";

type EntityResponseType = HttpResponse<IMyOrder>;
type EntityArrayResponseType = HttpResponse<IMyOrder[]>;

@Injectable({ providedIn: 'root' })
export class MyOrderService {
  public resourceUrl = SERVER_API_URL + 'api/my-orders';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/my-orders';
  private resourceCartUrl = SERVER_API_URL + 'api/my-cart';

  // Determine if paypal script is added to index or not
  public paypalScriptTagElement: any;
  // Determine if stripe script is added to index or not
  public stripeScriptTagElement: any;
  
  constructor(protected http: HttpClient, private router: Router) {}

  create(myOrder: IMyOrder): Observable<EntityResponseType> {
    return this.http.post<IMyOrder>(this.resourceUrl, myOrder, { observe: 'response' });
  }

  update(myOrder: IMyOrder): Observable<EntityResponseType> {
    return this.http.put<IMyOrder>(this.resourceUrl, myOrder, { observe: 'response' });
  }
  
  updateCheckout(myOrder: IMyOrder): Observable<EntityResponseType> {
      return this.http.put<IMyOrder>(`${this.resourceUrl}/updateCheckout`, myOrder, { observe: 'response' });
  }

  charge(myOrder: IMyOrder): Observable<EntityResponseType> {
      return this.http.put<IMyOrder>(`${this.resourceUrl}/charge`, myOrder, { observe: 'response' });
  }

  checkout(myOrder: IMyOrder): Observable<EntityResponseType> {
      const obj: IMyOrder = Object.assign(new MyOrder(), myOrder);
      obj.shops = [];
      myOrder.shops!.forEach(shop => {
          shop.items!.forEach(item => {
              if (item.isChecked) {
                  const itemIndex = shop.items!.indexOf(item, 0);
                  if (itemIndex > -1) {
                      let found = false;
                      for (let i = 0; i < obj.shops!.length; i++) {
                          const nShop = obj.shops![i];
                          if (nShop.id === shop.id) {
                              nShop.items!.push(item);
                              found = true;
                              break;
                          }
                      }
                      if (!found) {
                          const orderShop: IOrderShop = Object.assign(new OrderShop(), shop);
                          orderShop.items = [];
                          orderShop.items.push(item);
                          obj.shops!.push(orderShop);
                      }
                  }
              }
              /**if (!item.isChecked) {
                  const index = shop.items.indexOf(item, 0);
                  if (index > -1) {
                      shop.items.splice(index, 1);
                  }
              }*/
          });
          /** if (shop.items.length === 0) {
              const index = myOrder.shops.indexOf(shop, 0);
              if (index > -1) {
                  myOrder.shops.splice(index, 1);
              }
          } */
      });
      return this.http.put<IMyOrder>(`${this.resourceUrl}/checkout`, obj, { observe: 'response' });
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

  deleteOrderItem(orderItemId: number): Observable<HttpResponse<any>> {
      return this.http.delete<any>(`${this.resourceUrl}/orderItem/${orderItemId}`, { observe: 'response' });
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

  sumPrice(myOrder: IMyOrder | null, checkedOnly: boolean): number {
      let total = 0;
      if (myOrder && myOrder.shops) {
          myOrder.shops.forEach(shop => {
             shop.items!.forEach(item => {
                 if (item.quantity && item.price) {
                     if (checkedOnly) {
                         if (item.isChecked) {
                             total += (item.quantity * item.price);
                         }
                     } else {
                         total += (item.quantity * item.price);
                     }
                 }
             });
          });
      }
      return total;
  }

  sumPriceByShop(orderShop: IOrderShop | null): number {
      let total = 0;
      if (orderShop && orderShop.items) {
          orderShop.items.forEach(item => {
              if (item.quantity && item.price)
                  total += (item.quantity * item.price);
         });
      }
      return total;
  }

  sumShippingPrice(myOrder: IMyOrder | null): number {
      let total = 0;
      if (myOrder && myOrder.shops) {
          myOrder.shops.forEach(shop => {
              if (shop.shipping && shop.shipping.price) {
                  total += shop.shipping.price;
              }
          });
      }
      return total;
  }

  sumOrderPrice(myOrder: IMyOrder | null): number {
      return this.sumPrice(myOrder, false) + this.sumShippingPrice(myOrder);
  }
  
  sumQuantity(myOrder: IMyOrder | null, checkedOnly: boolean): number {
      let total = 0;
      if (myOrder && myOrder.shops) {
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
  
  sumChosenQuantity(myOrder: IMyOrder | null): number {
      let total = 0;
      if (myOrder && myOrder.shops) {
          myOrder.shops.forEach(shop => {
             console.error('shop.items: ' + shop.items);
             if (shop.items) {
                 shop.items.forEach(item => {
                     if (item.isChecked) {
                         total += 1;
                     }
                 });
             }
          });
      }
      return total;
  }

  getPaypalOrderItems(myOrder: IMyOrder | null): PaypalOrderItem[] {
      const paypalOrderItems: PaypalOrderItem[] = [];
      if (myOrder && myOrder.shops) {
          let paypalOrderItem: PaypalOrderItem;
          myOrder.shops.forEach(shop => {
              shop.items!.forEach(item => {
                  paypalOrderItem = Object.assign(new PaypalOrderItem());
                  paypalOrderItem.name = 'name' + item.id;
                  paypalOrderItem.description = 'product' + item.id;
                  paypalOrderItem.price = item.price;
                  paypalOrderItem.quantity = item.quantity;
                  paypalOrderItem.currency = item.currency;
                  paypalOrderItem.tax = 0;
                  paypalOrderItems.push(paypalOrderItem);
              });
          });
      }
      console.error('paypalOrderItems: ' + paypalOrderItems);
      return paypalOrderItems;
  }
}
