import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ShippingPriceRule } from './shipping-price-rule.model';
import { ShippingPriceRulePopupService } from './shipping-price-rule-popup.service';
import { ShippingPriceRuleService } from './shipping-price-rule.service';

@Component({
    selector: 'jhi-shipping-price-rule-delete-dialog',
    templateUrl: './shipping-price-rule-delete-dialog.component.html'
})
export class ShippingPriceRuleDeleteDialogComponent {

    shippingPriceRule: ShippingPriceRule;

    constructor(
        private shippingPriceRuleService: ShippingPriceRuleService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.shippingPriceRuleService.delete(id).subscribe((response) => {
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

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private shippingPriceRulePopupService: ShippingPriceRulePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.shippingPriceRulePopupService
                .open(ShippingPriceRuleDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
