import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IOffice } from 'app/shared/model/office.model';
import { OfficeService } from './office.service';
import { IAddress } from 'app/shared/model/address.model';
import { AddressService } from 'app/entities/address';
import { ICompany } from 'app/shared/model/company.model';
import { CompanyService } from 'app/entities/company';
import { IDepartment } from 'app/shared/model/department.model';
import { DepartmentService } from 'app/entities/department';

@Component({
    selector: 'jhi-office-update',
    templateUrl: './office-update.component.html'
})
export class OfficeUpdateComponent implements OnInit {
    office: IOffice;
    isSaving: boolean;

    addresses: IAddress[];

    companies: ICompany[];

    departments: IDepartment[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected officeService: OfficeService,
        protected addressService: AddressService,
        protected companyService: CompanyService,
        protected departmentService: DepartmentService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ office }) => {
            this.office = office;
        });
        this.addressService
            .query({ filter: 'office-is-null' })
            .pipe(
                filter((mayBeOk: HttpResponse<IAddress[]>) => mayBeOk.ok),
                map((response: HttpResponse<IAddress[]>) => response.body)
            )
            .subscribe(
                (res: IAddress[]) => {
                    if (!this.office.address || !this.office.address.id) {
                        this.addresses = res;
                    } else {
                        this.addressService
                            .find(this.office.address.id)
                            .pipe(
                                filter((subResMayBeOk: HttpResponse<IAddress>) => subResMayBeOk.ok),
                                map((subResponse: HttpResponse<IAddress>) => subResponse.body)
                            )
                            .subscribe(
                                (subRes: IAddress) => (this.addresses = [subRes].concat(res)),
                                (subRes: HttpErrorResponse) => this.onError(subRes.message)
                            );
                    }
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
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
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.office.id !== undefined) {
            this.subscribeToSaveResponse(this.officeService.update(this.office));
        } else {
            this.subscribeToSaveResponse(this.officeService.create(this.office));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IOffice>>) {
        result.subscribe((res: HttpResponse<IOffice>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackAddressById(index: number, item: IAddress) {
        return item.id;
    }

    trackCompanyById(index: number, item: ICompany) {
        return item.id;
    }

    trackDepartmentById(index: number, item: IDepartment) {
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
