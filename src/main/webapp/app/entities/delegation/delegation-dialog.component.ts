import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Delegation } from './delegation.model';
import { DelegationPopupService } from './delegation-popup.service';
import { DelegationService } from './delegation.service';
import { MyAccount, MyAccountService } from '../my-account';

@Component({
    selector: 'jhi-delegation-dialog',
    templateUrl: './delegation-dialog.component.html'
})
export class DelegationDialogComponent implements OnInit {

    delegation: Delegation;
    isSaving: boolean;

    myaccounts: MyAccount[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private delegationService: DelegationService,
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
        if (this.delegation.id !== undefined) {
            this.subscribeToSaveResponse(
                this.delegationService.update(this.delegation));
        } else {
            this.subscribeToSaveResponse(
                this.delegationService.create(this.delegation));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<Delegation>>) {
        result.subscribe((res: HttpResponse<Delegation>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: Delegation) {
        this.eventManager.broadcast({ name: 'delegationListModification', content: 'OK'});
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
    selector: 'jhi-delegation-popup',
    template: ''
})
export class DelegationPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private delegationPopupService: DelegationPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.delegationPopupService
                    .open(DelegationDialogComponent as Component, params['id']);
            } else {
                this.delegationPopupService
                    .open(DelegationDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
