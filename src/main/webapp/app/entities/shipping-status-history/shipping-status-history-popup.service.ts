import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { ShippingStatusHistory } from './shipping-status-history.model';
import { ShippingStatusHistoryService } from './shipping-status-history.service';

@Injectable()
export class ShippingStatusHistoryPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private datePipe: DatePipe,
        private modalService: NgbModal,
        private router: Router,
        private shippingStatusHistoryService: ShippingStatusHistoryService

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
                this.shippingStatusHistoryService.find(id)
                    .subscribe((shippingStatusHistoryResponse: HttpResponse<ShippingStatusHistory>) => {
                        const shippingStatusHistory: ShippingStatusHistory = shippingStatusHistoryResponse.body;
                        shippingStatusHistory.effectiveDate = this.datePipe
                            .transform(shippingStatusHistory.effectiveDate, 'yyyy-MM-ddTHH:mm:ss');
                        this.ngbModalRef = this.shippingStatusHistoryModalRef(component, shippingStatusHistory);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.shippingStatusHistoryModalRef(component, new ShippingStatusHistory());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    shippingStatusHistoryModalRef(component: Component, shippingStatusHistory: ShippingStatusHistory): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.shippingStatusHistory = shippingStatusHistory;
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
