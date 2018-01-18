import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { Quantity } from './quantity.model';
import { QuantityService } from './quantity.service';

@Injectable()
export class QuantityPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private datePipe: DatePipe,
        private modalService: NgbModal,
        private router: Router,
        private quantityService: QuantityService

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
                this.quantityService.find(id).subscribe((quantity) => {
                    quantity.from = this.datePipe
                        .transform(quantity.from, 'yyyy-MM-ddTHH:mm:ss');
                    quantity.to = this.datePipe
                        .transform(quantity.to, 'yyyy-MM-ddTHH:mm:ss');
                    this.ngbModalRef = this.quantityModalRef(component, quantity);
                    resolve(this.ngbModalRef);
                });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.quantityModalRef(component, new Quantity());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    quantityModalRef(component: Component, quantity: Quantity): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.quantity = quantity;
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
