import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { IProduct, Product } from 'app/shared/model/product.model';
import { ProductService } from './product.service';

@Injectable()
export class ProductPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private productService: ProductService
    ) {
        this.ngbModalRef = null;
    }

    open(component: Component, id?: number | any): Promise<NgbModalRef> {
        return new Promise<NgbModalRef>((resolve, reject) => {
            const isOpen = this.ngbModalRef !== null;
            if (isOpen) {
                resolve(this.ngbModalRef);
            }

            if (id) {
                this.productService.find(id)
                    .subscribe((productResponse: HttpResponse<IProduct>) => {
                        const product: IProduct = productResponse.body;
                        product.createdDate = product.createdDate != null ? moment(product.createdDate, DATE_TIME_FORMAT) : null;
                        product.lastModifiedDate = product.lastModifiedDate != null ? moment(product.lastModifiedDate, DATE_TIME_FORMAT) : null;
                        this.ngbModalRef = this.productModalRef(component, product);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.productModalRef(component, new Product());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    productModalRef(component: Component, product: IProduct): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.product = product;
        modalRef.result.then(result => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        }, reason => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        });
        return modalRef;
    }
}
