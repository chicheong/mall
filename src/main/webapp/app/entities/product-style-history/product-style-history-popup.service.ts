import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { ProductStyleHistory } from './product-style-history.model';
import { ProductStyleHistoryService } from './product-style-history.service';

@Injectable()
export class ProductStyleHistoryPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private datePipe: DatePipe,
        private modalService: NgbModal,
        private router: Router,
        private productStyleHistoryService: ProductStyleHistoryService

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
                this.productStyleHistoryService.find(id).subscribe((productStyleHistory) => {
                    productStyleHistory.createdDate = this.datePipe
                        .transform(productStyleHistory.createdDate, 'yyyy-MM-ddTHH:mm:ss');
                    this.ngbModalRef = this.productStyleHistoryModalRef(component, productStyleHistory);
                    resolve(this.ngbModalRef);
                });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.productStyleHistoryModalRef(component, new ProductStyleHistory());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    productStyleHistoryModalRef(component: Component, productStyleHistory: ProductStyleHistory): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.productStyleHistory = productStyleHistory;
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
