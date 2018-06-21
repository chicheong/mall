import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { CreditCard } from './credit-card.model';
import { CreditCardPopupService } from './credit-card-popup.service';
import { CreditCardService } from './credit-card.service';
import { MyAccount, MyAccountService } from '../my-account';

@Component({
    selector: 'jhi-credit-card-dialog',
    templateUrl: './credit-card-dialog.component.html'
})
export class CreditCardDialogComponent implements OnInit {

    creditCard: CreditCard;
    isSaving: boolean;

    myaccounts: MyAccount[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private creditCardService: CreditCardService,
        private myAccountService: MyAccountService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.myAccountService.query()
            .subscribe((res: HttpResponse<MyAccount[]>) => { this.myaccounts = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.creditCard.id !== undefined) {
            this.subscribeToSaveResponse(
                this.creditCardService.update(this.creditCard));
        } else {
            this.subscribeToSaveResponse(
                this.creditCardService.create(this.creditCard));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<CreditCard>>) {
        result.subscribe((res: HttpResponse<CreditCard>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: CreditCard) {
        this.eventManager.broadcast({ name: 'creditCardListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackMyAccountById(index: number, item: MyAccount) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-credit-card-popup',
    template: ''
})
export class CreditCardPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private creditCardPopupService: CreditCardPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.creditCardPopupService
                    .open(CreditCardDialogComponent as Component, params['id']);
            } else {
                this.creditCardPopupService
                    .open(CreditCardDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
