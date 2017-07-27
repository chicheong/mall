import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Shop } from './shop.model';
import { ShopPopupService } from './shop-popup.service';
import { ShopService } from './shop.service';
import { MyAccount, MyAccountService } from '../my-account';
import { ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-shop-dialog',
    templateUrl: './shop-dialog.component.html'
})
export class ShopDialogComponent implements OnInit {

    shop: Shop;
    isSaving: boolean;

    myaccounts: MyAccount[];

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private shopService: ShopService,
        private myAccountService: MyAccountService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.myAccountService.query()
            .subscribe((res: ResponseWrapper) => { this.myaccounts = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.shop.id !== undefined) {
            this.subscribeToSaveResponse(
                this.shopService.update(this.shop));
        } else {
            this.subscribeToSaveResponse(
                this.shopService.create(this.shop));
        }
    }

    private subscribeToSaveResponse(result: Observable<Shop>) {
        result.subscribe((res: Shop) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: Shop) {
        this.eventManager.broadcast({ name: 'shopListModification', content: 'OK'});
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

    trackMyAccountById(index: number, item: MyAccount) {
        return item.id;
    }

    getSelected(selectedVals: Array<any>, option: any) {
        if (selectedVals) {
            for (let i = 0; i < selectedVals.length; i++) {
                if (option.id === selectedVals[i].id) {
                    return selectedVals[i];
                }
            }
        }
        return option;
    }
}

@Component({
    selector: 'jhi-shop-popup',
    template: ''
})
export class ShopPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private shopPopupService: ShopPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.shopPopupService
                    .open(ShopDialogComponent as Component, params['id']);
            } else {
                this.shopPopupService
                    .open(ShopDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
