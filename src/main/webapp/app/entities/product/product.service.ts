import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { Product } from './product.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

import { Price } from '../price';
import { Quantity } from '../quantity';

import { PriceService } from '../price/price.service';
import { QuantityService } from '../quantity/quantity.service';

@Injectable()
export class ProductService {

    private resourceUrl = SERVER_API_URL + 'api/products';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/products';

    constructor(
            private http: Http,
            private dateUtils: JhiDateUtils,
            private priceService: PriceService,
            private quantityService: QuantityService
    ) { }

    create(product: Product): Observable<Product> {
        const copy = this.convert(product);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(product: Product): Observable<Product> {
        const copy = this.convert(product);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: number): Observable<Product> {
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
     * Convert a returned JSON object to Product.
     */
    private convertItemFromServer(json: any): Product {
        const entity: Product = Object.assign(new Product(), json);
        entity.createdDate = this.dateUtils
            .convertDateTimeFromServer(json.createdDate);
        entity.lastModifiedDate = this.dateUtils
            .convertDateTimeFromServer(json.lastModifiedDate);
        if (entity.items) {
            entity.items.forEach((item) => {
                if (item.prices) {
                    const prices: Price[] = [];
                    item.prices.forEach((price) => {
                        const copyPrice = this.priceService.convertItemFromServer(price);
                        prices.push(copyPrice);
                    });
                    item.prices = prices;
                }
                if (item.quantities) {
                    const quantities: Quantity[] = [];
                    item.quantities.forEach((quantity) => {
                        const copyQuantity = this.quantityService.convertItemFromServer(quantity);
                        quantities.push(copyQuantity);
                    });
                    item.quantities = quantities;
                }
            })
        }
        return entity;
    }

    /**
     * Convert a Product to a JSON which can be sent to the server.
     */
    private convert(product: Product): Product {
        const copy: Product = Object.assign({}, product);

        console.error('product.createdDate: ' + JSON.stringify(product.createdDate));
        console.error('product.lastModifiedDate: ' + JSON.stringify(product.lastModifiedDate));
        console.error('product.id: ' + product.id);
        // copy.createdDate = this.dateUtils.toDate(product.createdDate);
        // copy.lastModifiedDate = this.dateUtils.toDate(product.lastModifiedDate);
        if (copy.items) {
            copy.items.forEach((item) => {
                if (item.prices) {
                    const prices: Price[] = [];
                    item.prices.forEach((price) => {
                        const copyPrice = this.priceService.convert(price);
                        prices.push(copyPrice);
                    });
                    item.prices = prices;
                }
                if (item.quantities) {
                    const quantities: Quantity[] = [];
                    item.quantities.forEach((quantity) => {
                        const copyQuantity = this.quantityService.convert(quantity);
                        quantities.push(copyQuantity);
                    });
                    item.quantities = quantities;
                }
            })
        }
        return copy;
    }
}
