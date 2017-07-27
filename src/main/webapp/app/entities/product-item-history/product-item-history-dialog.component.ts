import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ProductItemHistory } from './product-item-history.model';
import { ProductItemHistoryPopupService } from './product-item-history-popup.service';
import { ProductItemHistoryService } from './product-item-history.service';
import { ProductItem, ProductItemService } from '../product-item';
import { ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-product-item-history-dialog',
    templateUrl: './product-item-history-dialog.component.html'
})
export class ProductItemHistoryDialogComponent implements OnInit {

    productItemHistory: ProductItemHistory;
    isSaving: boolean;

    productitems: ProductItem[];

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private productItemHistoryService: ProductItemHistoryService,
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
        if (this.productItemHistory.id !== undefined) {
            this.subscribeToSaveResponse(
                this.productItemHistoryService.update(this.productItemHistory));
        } else {
            this.subscribeToSaveResponse(
                this.productItemHistoryService.create(this.productItemHistory));
        }
    }

    private subscribeToSaveResponse(result: Observable<ProductItemHistory>) {
        result.subscribe((res: ProductItemHistory) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: ProductItemHistory) {
        this.eventManager.broadcast({ name: 'productItemHistoryListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError(error) {
        try {
            error.json();
        } catch (exception) {
            error.message = error.text();
        }
        this.isSaving = false;
        this.onError(error);
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }

    trackProductItemById(index: number, item: ProductItem) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-product-item-history-popup',
    template: ''
})
export class ProductItemHistoryPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private productItemHistoryPopupService: ProductItemHistoryPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.productItemHistoryPopupService
                    .open(ProductItemHistoryDialogComponent as Component, params['id']);
            } else {
                this.productItemHistoryPopupService
                    .open(ProductItemHistoryDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
