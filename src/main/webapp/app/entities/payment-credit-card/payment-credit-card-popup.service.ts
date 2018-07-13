import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { PaymentCreditCard } from './payment-credit-card.model';
import { PaymentCreditCardService } from './payment-credit-card.service';

@Injectable()
export class PaymentCreditCardPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private paymentCreditCardService: PaymentCreditCardService

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
                this.paymentCreditCardService.find(id)
                    .subscribe((paymentCreditCardResponse: HttpResponse<PaymentCreditCard>) => {
                        const paymentCreditCard: PaymentCreditCard = paymentCreditCardResponse.body;
                        this.ngbModalRef = this.paymentCreditCardModalRef(component, paymentCreditCard);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.paymentCreditCardModalRef(component, new PaymentCreditCard());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    paymentCreditCardModalRef(component: Component, paymentCreditCard: PaymentCreditCard): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.paymentCreditCard = paymentCreditCard;
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
