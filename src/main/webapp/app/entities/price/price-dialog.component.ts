import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Price } from './price.model';
import { PricePopupService } from './price-popup.service';
import { PriceService } from './price.service';
import { ProductItem, ProductItemService } from '../product-item';

@Component({
    selector: 'jhi-price-dialog',
    templateUrl: './price-dialog.component.html'
})
export class PriceDialogComponent implements OnInit {

    price: Price;
    isSaving: boolean;

    productitems: ProductItem[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private priceService: PriceService,
        private productItemService: ProductItemService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.productItemService.query()
            .subscribe((res: HttpResponse<ProductItem[]>) => { this.productitems = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.price.id !== undefined) {
            this.subscribeToSaveResponse(
                this.priceService.update(this.price));
        } else {
            this.subscribeToSaveResponse(
                this.priceService.create(this.price));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<Price>>) {
        result.subscribe((res: HttpResponse<Price>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: Price) {
        this.eventManager.broadcast({ name: 'priceListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackProductItemById(index: number, item: ProductItem) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-price-popup',
    template: ''
})
export class PricePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private pricePopupService: PricePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.pricePopupService
                    .open(PriceDialogComponent as Component, params['id']);
            } else {
                this.pricePopupService
                    .open(PriceDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
