import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { IProduct } from 'app/shared/model/product.model';
import { ProductItemsDialogType } from './product-items-dialog.component';

import { IProductItem } from 'app/shared/model/product-item.model';
import { IProductStyle, ProductStyleType } from 'app/shared/model/product-style.model';

@Injectable()
export class ProductDetailPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,

    ) {
        this.ngbModalRef = null;
    }

    open(component: Component, product?: IProduct, broadcastName?: string, type?: ProductItemsDialogType): Promise<NgbModalRef> {
        return new Promise<NgbModalRef>((resolve, reject) => {
            const isOpen = this.ngbModalRef !== null;
            if (isOpen) {
                resolve(this.ngbModalRef);
            }

            if (product) {
                this.ngbModalRef = this.productItemModalRef(component, product, broadcastName, type);
                resolve(this.ngbModalRef);
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.productItemModalRef(component, null, null, null);
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    productItemModalRef(component: Component, product: IProduct, broadcastName: string, type: ProductItemsDialogType): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.product = product;
        modalRef.componentInstance.broadcastName = broadcastName;
        modalRef.componentInstance.type = type;
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
