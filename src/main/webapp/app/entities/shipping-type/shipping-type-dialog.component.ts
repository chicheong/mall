import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ShippingType } from './shipping-type.model';
import { ShippingTypePopupService } from './shipping-type-popup.service';
import { ShippingTypeService } from './shipping-type.service';

@Component({
    selector: 'jhi-shipping-type-dialog',
    templateUrl: './shipping-type-dialog.component.html'
})
export class ShippingTypeDialogComponent implements OnInit {

    shippingType: ShippingType;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private shippingTypeService: ShippingTypeService,
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
        if (this.shippingType.id !== undefined) {
            this.subscribeToSaveResponse(
                this.shippingTypeService.update(this.shippingType));
        } else {
            this.subscribeToSaveResponse(
                this.shippingTypeService.create(this.shippingType));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<ShippingType>>) {
        result.subscribe((res: HttpResponse<ShippingType>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: ShippingType) {
        this.eventManager.broadcast({ name: 'shippingTypeListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }
}

@Component({
    selector: 'jhi-shipping-type-popup',
    template: ''
})
export class ShippingTypePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private shippingTypePopupService: ShippingTypePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.shippingTypePopupService
                    .open(ShippingTypeDialogComponent as Component, params['id']);
            } else {
                this.shippingTypePopupService
                    .open(ShippingTypeDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
