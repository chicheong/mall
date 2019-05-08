import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ShippingPriceRule } from './shipping-price-rule.model';
import { ShippingPriceRulePopupService } from './shipping-price-rule-popup.service';
import { ShippingPriceRuleService } from './shipping-price-rule.service';
import { Shop, ShopService } from '../shop';

@Component({
    selector: 'jhi-shipping-price-rule-dialog',
    templateUrl: './shipping-price-rule-dialog.component.html'
})
export class ShippingPriceRuleDialogComponent implements OnInit {

    shippingPriceRule: ShippingPriceRule;
    isSaving: boolean;

    shops: Shop[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private shippingPriceRuleService: ShippingPriceRuleService,
        private shopService: ShopService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.shopService.query()
            .subscribe((res: HttpResponse<Shop[]>) => { this.shops = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.shippingPriceRule.id !== undefined) {
            this.subscribeToSaveResponse(
                this.shippingPriceRuleService.update(this.shippingPriceRule));
        } else {
            this.subscribeToSaveResponse(
                this.shippingPriceRuleService.create(this.shippingPriceRule));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<ShippingPriceRule>>) {
        result.subscribe((res: HttpResponse<ShippingPriceRule>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: ShippingPriceRule) {
        this.eventManager.broadcast({ name: 'shippingPriceRuleListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackShopById(index: number, item: Shop) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-shipping-price-rule-popup',
    template: ''
})
export class ShippingPriceRulePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private shippingPriceRulePopupService: ShippingPriceRulePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.shippingPriceRulePopupService
                    .open(ShippingPriceRuleDialogComponent as Component, params['id']);
            } else {
                this.shippingPriceRulePopupService
                    .open(ShippingPriceRuleDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
