import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IShippingPriceRule } from 'app/shared/model/shipping-price-rule.model';
import { ShippingPriceRuleService } from './shipping-price-rule.service';

@Component({
    selector: 'jhi-shipping-price-rule-delete-dialog',
    templateUrl: './shipping-price-rule-delete-dialog.component.html'
})
export class ShippingPriceRuleDeleteDialogComponent {
    shippingPriceRule: IShippingPriceRule;

    constructor(
        protected shippingPriceRuleService: ShippingPriceRuleService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.shippingPriceRuleService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'shippingPriceRuleListModification',
                content: 'Deleted an shippingPriceRule'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-shipping-price-rule-delete-popup',
    template: ''
})
export class ShippingPriceRuleDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ shippingPriceRule }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(ShippingPriceRuleDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.shippingPriceRule = shippingPriceRule;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/shipping-price-rule', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/shipping-price-rule', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    }
                );
            }, 0);
        });
    }

    ngOnDestroy() {
        this.ngbModalRef = null;
    }
}
