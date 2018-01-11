import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ProductItem } from './../product-item/product-item.model';

import { ProductStyle, ProductStyleType } from './../product-style';
import { ProductItemsDialogType } from './product-items-dialog.component';

@Injectable()
export class ProductItemsPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,

    ) {
        this.ngbModalRef = null;
    }

    open(component: Component, items?: ProductItem[], colors?: ProductStyle[], sizes?: ProductStyle[], type?: ProductItemsDialogType): Promise<NgbModalRef> {
        return new Promise<NgbModalRef>((resolve, reject) => {
            const isOpen = this.ngbModalRef !== null;
            if (isOpen) {
                resolve(this.ngbModalRef);
            }

            if (items) {
                this.ngbModalRef = this.productItemModalRef(component, items, colors, sizes, type);
                resolve(this.ngbModalRef);
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.productItemModalRef(component, null, null, null, null);
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    productItemModalRef(component: Component, productItems: ProductItem[], colors: ProductStyle[], sizes: ProductStyle[], type: ProductItemsDialogType): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.productItems = productItems;
        modalRef.componentInstance.colors = colors;
        modalRef.componentInstance.sizes = sizes;
        modalRef.componentInstance.type = type;
        modalRef.result.then((result) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        });
        return modalRef;
    }
}
