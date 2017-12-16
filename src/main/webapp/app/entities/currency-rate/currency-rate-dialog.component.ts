import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { CurrencyRate } from './currency-rate.model';
import { CurrencyRatePopupService } from './currency-rate-popup.service';
import { CurrencyRateService } from './currency-rate.service';

@Component({
    selector: 'jhi-currency-rate-dialog',
    templateUrl: './currency-rate-dialog.component.html'
})
export class CurrencyRateDialogComponent implements OnInit {

    currencyRate: CurrencyRate;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private currencyRateService: CurrencyRateService,
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
        if (this.currencyRate.id !== undefined) {
            this.subscribeToSaveResponse(
                this.currencyRateService.update(this.currencyRate));
        } else {
            this.subscribeToSaveResponse(
                this.currencyRateService.create(this.currencyRate));
        }
    }

    private subscribeToSaveResponse(result: Observable<CurrencyRate>) {
        result.subscribe((res: CurrencyRate) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: CurrencyRate) {
        this.eventManager.broadcast({ name: 'currencyRateListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }
}

@Component({
    selector: 'jhi-currency-rate-popup',
    template: ''
})
export class CurrencyRatePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private currencyRatePopupService: CurrencyRatePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.currencyRatePopupService
                    .open(CurrencyRateDialogComponent as Component, params['id']);
            } else {
                this.currencyRatePopupService
                    .open(CurrencyRateDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
