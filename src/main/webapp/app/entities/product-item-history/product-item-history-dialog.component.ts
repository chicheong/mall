import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ProductItemHistory } from './product-item-history.model';
import { ProductItemHistoryPopupService } from './product-item-history-popup.service';
import { ProductItemHistoryService } from './product-item-history.service';

import { ProductItem, ProductItemService } from '../product-item';

@Component({
    selector: 'jhi-product-item-history-dialog',
    templateUrl: './product-item-history-dialog.component.html'
})
export class ProductItemHistoryDialogComponent implements OnInit {

    productItemHistory: ProductItemHistory;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private productItemHistoryService: ProductItemHistoryService,
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
        if (this.productItemHistory.id !== undefined) {
            this.subscribeToSaveResponse(
                this.productItemHistoryService.update(this.productItemHistory));
        } else {
            this.subscribeToSaveResponse(
                this.productItemHistoryService.create(this.productItemHistory));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<ProductItemHistory>>) {
        result.subscribe((res: HttpResponse<ProductItemHistory>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: ProductItemHistory) {
        this.eventManager.broadcast({ name: 'productItemHistoryListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
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
