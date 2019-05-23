import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { ICompany } from 'app/shared/model/company.model';
import { CompanyService } from './company.service';
import { IDepartment } from 'app/shared/model/department.model';
import { DepartmentService } from 'app/entities/department';
import { IOffice } from 'app/shared/model/office.model';
import { OfficeService } from 'app/entities/office';

@Component({
    selector: 'jhi-company-update',
    templateUrl: './company-update.component.html'
})
export class CompanyUpdateComponent implements OnInit {
    company: ICompany;
    isSaving: boolean;

    companies: ICompany[];

    departments: IDepartment[];

    offices: IOffice[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected companyService: CompanyService,
        protected departmentService: DepartmentService,
        protected officeService: OfficeService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ company }) => {
            this.company = company;
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
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.company.id !== undefined) {
            this.subscribeToSaveResponse(this.companyService.update(this.company));
        } else {
            this.subscribeToSaveResponse(this.companyService.create(this.company));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<ICompany>>) {
        result.subscribe((res: HttpResponse<ICompany>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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
