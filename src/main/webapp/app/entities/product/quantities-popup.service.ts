import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { Quantity } from '../quantity';
import { ProductItem } from '../product-item';

@Injectable()
export class QuantitiesPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private datePipe: DatePipe,
        private modalService: NgbModal,
        private router: Router

    ) {
        this.ngbModalRef = null;
    }

    open(component: Component, item?: ProductItem, broadcastName?: string): Promise<NgbModalRef> {
        return new Promise<NgbModalRef>((resolve, reject) => {
            const isOpen = this.ngbModalRef !== null;
            if (isOpen) {
                resolve(this.ngbModalRef);
            }

            if (item) {
                // quantity.from = this.datePipe.transform(quantity.from, 'yyyy-MM-ddTHH:mm:ss');
                // quantity.to = this.datePipe.transform(quantity.to, 'yyyy-MM-ddTHH:mm:ss');
                this.ngbModalRef = this.quantityModalRef(component, item, broadcastName);
                resolve(this.ngbModalRef);
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.quantityModalRef(component, new ProductItem(), broadcastName);
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    quantityModalRef(component: Component, item: ProductItem, broadcastName: string): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.productItem = item;
        modalRef.componentInstance.broadcastName = broadcastName;
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
