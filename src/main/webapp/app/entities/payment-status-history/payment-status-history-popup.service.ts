import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { PaymentStatusHistory } from './payment-status-history.model';
import { PaymentStatusHistoryService } from './payment-status-history.service';

@Injectable()
export class PaymentStatusHistoryPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private datePipe: DatePipe,
        private modalService: NgbModal,
        private router: Router,
        private paymentStatusHistoryService: PaymentStatusHistoryService

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
                this.paymentStatusHistoryService.find(id)
                    .subscribe((paymentStatusHistoryResponse: HttpResponse<PaymentStatusHistory>) => {
                        const paymentStatusHistory: PaymentStatusHistory = paymentStatusHistoryResponse.body;
                        paymentStatusHistory.effectiveDate = this.datePipe
                            .transform(paymentStatusHistory.effectiveDate, 'yyyy-MM-ddTHH:mm:ss');
                        this.ngbModalRef = this.paymentStatusHistoryModalRef(component, paymentStatusHistory);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.paymentStatusHistoryModalRef(component, new PaymentStatusHistory());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    paymentStatusHistoryModalRef(component: Component, paymentStatusHistory: PaymentStatusHistory): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.paymentStatusHistory = paymentStatusHistory;
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
