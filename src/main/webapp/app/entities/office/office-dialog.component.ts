import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Office } from './office.model';
import { OfficePopupService } from './office-popup.service';
import { OfficeService } from './office.service';
import { Address, AddressService } from '../address';
import { Company, CompanyService } from '../company';
import { Department, DepartmentService } from '../department';
import { ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-office-dialog',
    templateUrl: './office-dialog.component.html'
})
export class OfficeDialogComponent implements OnInit {

    office: Office;
    isSaving: boolean;

    addresses: Address[];

    companies: Company[];

    departments: Department[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private officeService: OfficeService,
        private addressService: AddressService,
        private companyService: CompanyService,
        private departmentService: DepartmentService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.addressService
            .query({filter: 'office-is-null'})
            .subscribe((res: ResponseWrapper) => {
                if (!this.office.address || !this.office.address.id) {
                    this.addresses = res.json;
                } else {
                    this.addressService
                        .find(this.office.address.id)
                        .subscribe((subRes: Address) => {
                            this.addresses = [subRes].concat(res.json);
                        }, (subRes: ResponseWrapper) => this.onError(subRes.json));
                }
            }, (res: ResponseWrapper) => this.onError(res.json));
        this.companyService.query()
            .subscribe((res: ResponseWrapper) => { this.companies = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
        this.departmentService.query()
            .subscribe((res: ResponseWrapper) => { this.departments = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.office.id !== undefined) {
            this.subscribeToSaveResponse(
                this.officeService.update(this.office));
        } else {
            this.subscribeToSaveResponse(
                this.officeService.create(this.office));
        }
    }

    private subscribeToSaveResponse(result: Observable<Office>) {
        result.subscribe((res: Office) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: Office) {
        this.eventManager.broadcast({ name: 'officeListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackAddressById(index: number, item: Address) {
        return item.id;
    }

    trackCompanyById(index: number, item: Company) {
        return item.id;
    }

    trackDepartmentById(index: number, item: Department) {
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
    selector: 'jhi-office-popup',
    template: ''
})
export class OfficePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private officePopupService: OfficePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.officePopupService
                    .open(OfficeDialogComponent as Component, params['id']);
            } else {
                this.officePopupService
                    .open(OfficeDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
