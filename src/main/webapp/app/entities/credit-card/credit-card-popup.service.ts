import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { CreditCard } from './credit-card.model';
import { CreditCardService } from './credit-card.service';

@Injectable()
export class CreditCardPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private datePipe: DatePipe,
        private modalService: NgbModal,
        private router: Router,
        private creditCardService: CreditCardService

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
                this.creditCardService.find(id)
                    .subscribe((creditCardResponse: HttpResponse<CreditCard>) => {
                        const creditCard: CreditCard = creditCardResponse.body;
                        creditCard.expireDate = this.datePipe
                            .transform(creditCard.expireDate, 'yyyy-MM-ddTHH:mm:ss');
                        this.ngbModalRef = this.creditCardModalRef(component, creditCard);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.creditCardModalRef(component, new CreditCard());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    creditCardModalRef(component: Component, creditCard: CreditCard): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.creditCard = creditCard;
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
