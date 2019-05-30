import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IProduct } from 'app/shared/model/product.model';

import { IPrice } from 'app/shared/model/price.model';
import { IQuantity } from 'app/shared/model/quantity.model';

import { PriceService } from 'app/entities/price';
import { QuantityService } from 'app/entities/quantity';

type EntityResponseType = HttpResponse<IProduct>;
type EntityArrayResponseType = HttpResponse<IProduct[]>;

@Injectable({ providedIn: 'root' })
export class ProductService {
    public resourceUrl = SERVER_API_URL + 'api/products';
    public resourceSearchUrl = SERVER_API_URL + 'api/_search/products';

    constructor(
        protected http: HttpClient,
        private priceService: PriceService,
        private quantityService: QuantityService
    ) {}

    create(product: IProduct): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(product);
        return this.http
            .post<IProduct>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(product: IProduct): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(product);
        return this.http
            .put<IProduct>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IProduct>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IProduct[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IProduct[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    protected convertDateFromClient(product: IProduct): IProduct {
        const copy: IProduct = Object.assign({}, product, {
            createdDate: product.createdDate != null && product.createdDate.isValid() ? product.createdDate.toJSON() : null,
            lastModifiedDate:
                product.lastModifiedDate != null && product.lastModifiedDate.isValid() ? product.lastModifiedDate.toJSON() : null
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
            res.body.forEach((product: IProduct) => {
                product.createdDate = product.createdDate != null ? moment(product.createdDate) : null;
                product.lastModifiedDate = product.lastModifiedDate != null ? moment(product.lastModifiedDate) : null;
            });
        }
        return res;
    }

    /**
     * Convert a returned JSON object to Product.
     */
    private convertItemFromServer(product: IProduct): IProduct {
        const copy: IProduct = Object.assign({}, product);
        copy.createdDate = product.createdDate != null ? moment(product.createdDate) : null;
        copy.lastModifiedDate = product.lastModifiedDate != null ? moment(product.lastModifiedDate) : null;
        if (copy.items) {
            copy.items.forEach(item => {
                if (item.prices) {
                    const prices: IPrice[] = [];
                    item.prices.forEach(price => {
                        // const copyPrice = this.priceService.convertItemFromServer(price);
                        prices.push(price);
                    });
                    item.prices = prices;
                }
                if (item.quantities) {
                    const quantities: IQuantity[] = [];
                    item.quantities.forEach(quantity => {
                        // const copyQuantity = this.quantityService.convertItemFromServer(quantity);
                        quantities.push(quantity);
                    });
                    item.quantities = quantities;
                }
            });
        }
        return copy;
    }

    /**
     * Convert a Product to a JSON which can be sent to the server.
     */
    private convert(product: IProduct): IProduct {
        const copy: IProduct = Object.assign({}, product);

        console.error('product.createdDate: ' + JSON.stringify(product.createdDate));
        console.error('product.lastModifiedDate: ' + JSON.stringify(product.lastModifiedDate));
        console.error('product.id: ' + product.id);
        // copy.createdDate = this.dateUtils.toDate(product.createdDate);
        // copy.lastModifiedDate = this.dateUtils.toDate(product.lastModifiedDate);
        if (copy.items) {
            copy.items.forEach(item => {
                if (item.prices) {
                    const prices: IPrice[] = [];
                    item.prices.forEach(price => {
                        // const copyPrice = this.priceService.convert(price);
                        prices.push(price);
                    });
                    item.prices = prices;
                }
                if (item.quantities) {
                    const quantities: IQuantity[] = [];
                    item.quantities.forEach(quantity => {
                        // const copyQuantity = this.quantityService.convert(quantity);
                        quantities.push(quantity);
                    });
                    item.quantities = quantities;
                }
            });
        }
        return copy;
    }
}
