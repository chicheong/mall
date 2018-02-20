import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { MyAccount } from './my-account.model';
import { MyAccountPopupService } from './my-account-popup.service';
import { MyAccountService } from './my-account.service';
import { Company, CompanyService } from '../company';
import { Department, DepartmentService } from '../department';
import { Office, OfficeService } from '../office';
import { Shop, ShopService } from '../shop';
import { UserInfo, UserInfoService } from '../user-info';

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
        private jhiAlertService: JhiAlertService,
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
            .subscribe((res: HttpResponse<Company[]>) => { this.companies = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.departmentService.query()
            .subscribe((res: HttpResponse<Department[]>) => { this.departments = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.officeService.query()
            .subscribe((res: HttpResponse<Office[]>) => { this.offices = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.shopService.query()
            .subscribe((res: HttpResponse<Shop[]>) => { this.shops = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.userInfoService.query()
            .subscribe((res: HttpResponse<UserInfo[]>) => { this.userinfos = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
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

    private subscribeToSaveResponse(result: Observable<HttpResponse<MyAccount>>) {
        result.subscribe((res: HttpResponse<MyAccount>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: MyAccount) {
        this.eventManager.broadcast({ name: 'myAccountListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
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
