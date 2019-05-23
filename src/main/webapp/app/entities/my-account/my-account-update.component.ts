import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IMyAccount } from 'app/shared/model/my-account.model';
import { MyAccountService } from './my-account.service';
import { ICompany } from 'app/shared/model/company.model';
import { CompanyService } from 'app/entities/company';
import { IDepartment } from 'app/shared/model/department.model';
import { DepartmentService } from 'app/entities/department';
import { IOffice } from 'app/shared/model/office.model';
import { OfficeService } from 'app/entities/office';
import { IShop } from 'app/shared/model/shop.model';
import { ShopService } from 'app/entities/shop';
import { IUserInfo } from 'app/shared/model/user-info.model';
import { UserInfoService } from 'app/entities/user-info';

@Component({
    selector: 'jhi-my-account-update',
    templateUrl: './my-account-update.component.html'
})
export class MyAccountUpdateComponent implements OnInit {
    myAccount: IMyAccount;
    isSaving: boolean;

    companies: ICompany[];

    departments: IDepartment[];

    offices: IOffice[];

    shops: IShop[];

    userinfos: IUserInfo[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected myAccountService: MyAccountService,
        protected companyService: CompanyService,
        protected departmentService: DepartmentService,
        protected officeService: OfficeService,
        protected shopService: ShopService,
        protected userInfoService: UserInfoService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ myAccount }) => {
            this.myAccount = myAccount;
        });
        this.companyService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<ICompany[]>) => mayBeOk.ok),
                map((response: HttpResponse<ICompany[]>) => response.body)
            )
            .subscribe((res: ICompany[]) => (this.companies = res), (res: HttpErrorResponse) => this.onError(res.message));
        this.departmentService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IDepartment[]>) => mayBeOk.ok),
                map((response: HttpResponse<IDepartment[]>) => response.body)
            )
            .subscribe((res: IDepartment[]) => (this.departments = res), (res: HttpErrorResponse) => this.onError(res.message));
        this.officeService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IOffice[]>) => mayBeOk.ok),
                map((response: HttpResponse<IOffice[]>) => response.body)
            )
            .subscribe((res: IOffice[]) => (this.offices = res), (res: HttpErrorResponse) => this.onError(res.message));
        this.shopService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IShop[]>) => mayBeOk.ok),
                map((response: HttpResponse<IShop[]>) => response.body)
            )
            .subscribe((res: IShop[]) => (this.shops = res), (res: HttpErrorResponse) => this.onError(res.message));
        this.userInfoService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IUserInfo[]>) => mayBeOk.ok),
                map((response: HttpResponse<IUserInfo[]>) => response.body)
            )
            .subscribe((res: IUserInfo[]) => (this.userinfos = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.myAccount.id !== undefined) {
            this.subscribeToSaveResponse(this.myAccountService.update(this.myAccount));
        } else {
            this.subscribeToSaveResponse(this.myAccountService.create(this.myAccount));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IMyAccount>>) {
        result.subscribe((res: HttpResponse<IMyAccount>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackCompanyById(index: number, item: ICompany) {
        return item.id;
    }

    trackDepartmentById(index: number, item: IDepartment) {
        return item.id;
    }

    trackOfficeById(index: number, item: IOffice) {
        return item.id;
    }

    trackShopById(index: number, item: IShop) {
        return item.id;
    }

    trackUserInfoById(index: number, item: IUserInfo) {
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
