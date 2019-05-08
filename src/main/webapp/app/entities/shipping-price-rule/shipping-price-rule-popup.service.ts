import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { ShippingPriceRule } from './shipping-price-rule.model';
import { ShippingPriceRuleService } from './shipping-price-rule.service';

@Injectable()
export class ShippingPriceRulePopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private shippingPriceRuleService: ShippingPriceRuleService

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
                this.shippingPriceRuleService.find(id)
                    .subscribe((shippingPriceRuleResponse: HttpResponse<ShippingPriceRule>) => {
                        const shippingPriceRule: ShippingPriceRule = shippingPriceRuleResponse.body;
                        this.ngbModalRef = this.shippingPriceRuleModalRef(component, shippingPriceRule);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.shippingPriceRuleModalRef(component, new ShippingPriceRule());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    shippingPriceRuleModalRef(component: Component, shippingPriceRule: ShippingPriceRule): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.shippingPriceRule = shippingPriceRule;
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
