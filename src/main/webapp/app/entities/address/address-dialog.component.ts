import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Address } from './address.model';
import { AddressPopupService } from './address-popup.service';
import { AddressService } from './address.service';
import { Country, CountryService } from '../country';
import { State, StateService } from '../state';

@Component({
    selector: 'jhi-address-dialog',
    templateUrl: './address-dialog.component.html'
})
export class AddressDialogComponent implements OnInit {

    address: Address;
    isSaving: boolean;

    countries: Country[];

    states: State[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private addressService: AddressService,
        private countryService: CountryService,
        private stateService: StateService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.countryService.query()
            .subscribe((res: HttpResponse<Country[]>) => { this.countries = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.stateService.query()
            .subscribe((res: HttpResponse<State[]>) => { this.states = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.address.id !== undefined) {
            this.subscribeToSaveResponse(
                this.addressService.update(this.address));
        } else {
            this.subscribeToSaveResponse(
                this.addressService.create(this.address));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<Address>>) {
        result.subscribe((res: HttpResponse<Address>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: Address) {
        this.eventManager.broadcast({ name: 'addressListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackCountryById(index: number, item: Country) {
        return item.id;
    }

    trackStateById(index: number, item: State) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-address-popup',
    template: ''
})
export class AddressPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private addressPopupService: AddressPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.addressPopupService
                    .open(AddressDialogComponent as Component, params['id']);
            } else {
                this.addressPopupService
                    .open(AddressDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
