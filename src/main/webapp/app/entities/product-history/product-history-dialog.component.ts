import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ProductHistory } from './product-history.model';
import { ProductHistoryPopupService } from './product-history-popup.service';
import { ProductHistoryService } from './product-history.service';

@Component({
    selector: 'jhi-product-history-dialog',
    templateUrl: './product-history-dialog.component.html'
})
export class ProductHistoryDialogComponent implements OnInit {

    productHistory: ProductHistory;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private productHistoryService: ProductHistoryService,
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
        if (this.productHistory.id !== undefined) {
            this.subscribeToSaveResponse(
                this.productHistoryService.update(this.productHistory));
        } else {
            this.subscribeToSaveResponse(
                this.productHistoryService.create(this.productHistory));
        }
    }

    private subscribeToSaveResponse(result: Observable<ProductHistory>) {
        result.subscribe((res: ProductHistory) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: ProductHistory) {
        this.eventManager.broadcast({ name: 'productHistoryListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }
}

@Component({
    selector: 'jhi-product-history-popup',
    template: ''
})
export class ProductHistoryPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private productHistoryPopupService: ProductHistoryPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.productHistoryPopupService
                    .open(ProductHistoryDialogComponent as Component, params['id']);
            } else {
                this.productHistoryPopupService
                    .open(ProductHistoryDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
