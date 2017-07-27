import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { ProductItemHistory } from './product-item-history.model';
import { ProductItemHistoryService } from './product-item-history.service';

@Injectable()
export class ProductItemHistoryPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private datePipe: DatePipe,
        private modalService: NgbModal,
        private router: Router,
        private productItemHistoryService: ProductItemHistoryService

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
                this.productItemHistoryService.find(id).subscribe((productItemHistory) => {
                    productItemHistory.createdDate = this.datePipe
                        .transform(productItemHistory.createdDate, 'yyyy-MM-ddThh:mm');
                    productItemHistory.lastModifiedDate = this.datePipe
                        .transform(productItemHistory.lastModifiedDate, 'yyyy-MM-ddThh:mm');
                    this.ngbModalRef = this.productItemHistoryModalRef(component, productItemHistory);
                    resolve(this.ngbModalRef);
                });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.productItemHistoryModalRef(component, new ProductItemHistory());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    productItemHistoryModalRef(component: Component, productItemHistory: ProductItemHistory): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.productItemHistory = productItemHistory;
        modalRef.result.then((result) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true });
            this.ngbModalRef = null;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true });
            this.ngbModalRef = null;
        });
        return modalRef;
    }
}
