import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Quantity } from './quantity.model';
import { QuantityPopupService } from './quantity-popup.service';
import { QuantityService } from './quantity.service';
import { ProductItem, ProductItemService } from '../product-item';
import { ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-quantity-dialog',
    templateUrl: './quantity-dialog.component.html'
})
export class QuantityDialogComponent implements OnInit {

    quantity: Quantity;
    isSaving: boolean;

    productitems: ProductItem[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private quantityService: QuantityService,
        private productItemService: ProductItemService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.productItemService.query()
            .subscribe((res: ResponseWrapper) => { this.productitems = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.quantity.id !== undefined) {
            this.subscribeToSaveResponse(
                this.quantityService.update(this.quantity));
        } else {
            this.subscribeToSaveResponse(
                this.quantityService.create(this.quantity));
        }
    }

    private subscribeToSaveResponse(result: Observable<Quantity>) {
        result.subscribe((res: Quantity) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: Quantity) {
        this.eventManager.broadcast({ name: 'quantityListModification', content: 'OK'});
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
    selector: 'jhi-quantity-popup',
    template: ''
})
export class QuantityPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private quantityPopupService: QuantityPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.quantityPopupService
                    .open(QuantityDialogComponent as Component, params['id']);
            } else {
                this.quantityPopupService
                    .open(QuantityDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
