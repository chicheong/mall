import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { Product } from './product.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<Product>;

import { Price } from '../price';
import { Quantity } from '../quantity';

import { PriceService } from '../price/price.service';
import { QuantityService } from '../quantity/quantity.service';

@Injectable()
export class FileService {

    private resourceUrl =  SERVER_API_URL + 'api/fileUpload';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/fileUploads';

    constructor(
            private http: HttpClient,
            private dateUtils: JhiDateUtils,
            private priceService: PriceService,
            private quantityService: QuantityService
    ) { }

    upload(files: FileList, parameters) {
        const formData: FormData = new FormData();
//        files.forEach((file) => {
//            formData.append(file.name, file, file.name);
//        })
        return this.http.post(this.resourceUrl, formData, { observe: 'response' })
            .map((res: EntityResponseType) => { return true; });
    }

    create(product: Product): Observable<EntityResponseType> {
        const copy = this.convert(product);
        return this.http.post<Product>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(product: Product): Observable<EntityResponseType> {
        const copy = this.convert(product);
        return this.http.put<Product>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Product>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<Product[]>> {
        const options = createRequestOption(req);
        return this.http.get<Product[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Product[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Product = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Product[]>): HttpResponse<Product[]> {
        const jsonResponse: Product[] = res.body;
        const body: Product[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Product.
     */
    private convertItemFromServer(product: Product): Product {
        const copy: Product = Object.assign({}, product);
        copy.createdDate = this.dateUtils
            .convertDateTimeFromServer(product.createdDate);
        copy.lastModifiedDate = this.dateUtils
            .convertDateTimeFromServer(product.lastModifiedDate);
        if (copy.items) {
            copy.items.forEach((item) => {
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
            });
        }
        return copy;
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
            });
        }
        return copy;
    }
}