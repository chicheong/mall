import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { CurrencyRate } from './currency-rate.model';
import { CurrencyRateService } from './currency-rate.service';

@Injectable()
export class CurrencyRatePopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private datePipe: DatePipe,
        private modalService: NgbModal,
        private router: Router,
        private currencyRateService: CurrencyRateService

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
                this.currencyRateService.find(id)
                    .subscribe((currencyRateResponse: HttpResponse<CurrencyRate>) => {
                        const currencyRate: CurrencyRate = currencyRateResponse.body;
                        currencyRate.from = this.datePipe
                            .transform(currencyRate.from, 'yyyy-MM-ddTHH:mm:ss');
                        currencyRate.to = this.datePipe
                            .transform(currencyRate.to, 'yyyy-MM-ddTHH:mm:ss');
                        this.ngbModalRef = this.currencyRateModalRef(component, currencyRate);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.currencyRateModalRef(component, new CurrencyRate());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    currencyRateModalRef(component: Component, currencyRate: CurrencyRate): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.currencyRate = currencyRate;
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
