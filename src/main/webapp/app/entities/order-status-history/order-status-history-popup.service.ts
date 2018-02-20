import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { OrderStatusHistory } from './order-status-history.model';
import { OrderStatusHistoryService } from './order-status-history.service';

@Injectable()
export class OrderStatusHistoryPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private datePipe: DatePipe,
        private modalService: NgbModal,
        private router: Router,
        private orderStatusHistoryService: OrderStatusHistoryService

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
                this.orderStatusHistoryService.find(id)
                    .subscribe((orderStatusHistoryResponse: HttpResponse<OrderStatusHistory>) => {
                        const orderStatusHistory: OrderStatusHistory = orderStatusHistoryResponse.body;
                        orderStatusHistory.effectiveDate = this.datePipe
                            .transform(orderStatusHistory.effectiveDate, 'yyyy-MM-ddTHH:mm:ss');
                        this.ngbModalRef = this.orderStatusHistoryModalRef(component, orderStatusHistory);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.orderStatusHistoryModalRef(component, new OrderStatusHistory());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    orderStatusHistoryModalRef(component: Component, orderStatusHistory: OrderStatusHistory): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.orderStatusHistory = orderStatusHistory;
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
