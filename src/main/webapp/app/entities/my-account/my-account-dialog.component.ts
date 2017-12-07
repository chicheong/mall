import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { MyAccount } from './my-account.model';
import { MyAccountPopupService } from './my-account-popup.service';
import { MyAccountService } from './my-account.service';
import { Company, CompanyService } from '../company';
import { Department, DepartmentService } from '../department';
import { Office, OfficeService } from '../office';
import { Shop, ShopService } from '../shop';
import { UserInfo, UserInfoService } from '../user-info';
import { ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-my-account-dialog',
    templateUrl: './my-account-dialog.component.html'
})
export class MyAccountDialogComponent implements OnInit {

    myAccount: MyAccount;
    isSaving: boolean;

    companies: Company[];

    departments: Department[];

    offices: Office[];

    shops: Shop[];

    userinfos: UserInfo[];

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private myAccountService: MyAccountService,
        private companyService: CompanyService,
        private departmentService: DepartmentService,
        private officeService: OfficeService,
        private shopService: ShopService,
        private userInfoService: UserInfoService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.companyService.query()
            .subscribe((res: ResponseWrapper) => { this.companies = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
        this.departmentService.query()
            .subscribe((res: ResponseWrapper) => { this.departments = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
        this.officeService.query()
            .subscribe((res: ResponseWrapper) => { this.offices = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
        this.shopService.query()
            .subscribe((res: ResponseWrapper) => { this.shops = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
        this.userInfoService.query()
            .subscribe((res: ResponseWrapper) => { this.userinfos = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.myAccount.id !== undefined) {
            this.subscribeToSaveResponse(
                this.myAccountService.update(this.myAccount));
        } else {
            this.subscribeToSaveResponse(
                this.myAccountService.create(this.myAccount));
        }
    }

    private subscribeToSaveResponse(result: Observable<MyAccount>) {
        result.subscribe((res: MyAccount) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: MyAccount) {
        this.eventManager.broadcast({ name: 'myAccountListModification', content: 'OK'});
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

    trackCompanyById(index: number, item: Company) {
        return item.id;
    }

    trackDepartmentById(index: number, item: Department) {
        return item.id;
    }

    trackOfficeById(index: number, item: Office) {
        return item.id;
    }

    trackShopById(index: number, item: Shop) {
        return item.id;
    }

    trackUserInfoById(index: number, item: UserInfo) {
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
    selector: 'jhi-my-account-popup',
    template: ''
})
export class MyAccountPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private myAccountPopupService: MyAccountPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.myAccountPopupService
                    .open(MyAccountDialogComponent as Component, params['id']);
            } else {
                this.myAccountPopupService
                    .open(MyAccountDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
