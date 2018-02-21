import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ProductStyleHistory } from './product-style-history.model';
import { ProductStyleHistoryPopupService } from './product-style-history-popup.service';
import { ProductStyleHistoryService } from './product-style-history.service';

@Component({
    selector: 'jhi-product-style-history-dialog',
    templateUrl: './product-style-history-dialog.component.html'
})
export class ProductStyleHistoryDialogComponent implements OnInit {

    productStyleHistory: ProductStyleHistory;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private productStyleHistoryService: ProductStyleHistoryService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.productStyleHistory.id !== undefined) {
            this.subscribeToSaveResponse(
                this.productStyleHistoryService.update(this.productStyleHistory));
        } else {
            this.subscribeToSaveResponse(
                this.productStyleHistoryService.create(this.productStyleHistory));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<ProductStyleHistory>>) {
        result.subscribe((res: HttpResponse<ProductStyleHistory>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: ProductStyleHistory) {
        this.eventManager.broadcast({ name: 'productStyleHistoryListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }
}

@Component({
    selector: 'jhi-product-style-history-popup',
    template: ''
})
export class ProductStyleHistoryPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private productStyleHistoryPopupService: ProductStyleHistoryPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.productStyleHistoryPopupService
                    .open(ProductStyleHistoryDialogComponent as Component, params['id']);
            } else {
                this.productStyleHistoryPopupService
                    .open(ProductStyleHistoryDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
