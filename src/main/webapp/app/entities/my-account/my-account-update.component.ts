import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IMyAccount, MyAccount } from 'app/shared/model/my-account.model';
import { MyAccountService } from './my-account.service';
import { ICompany } from 'app/shared/model/company.model';
import { CompanyService } from 'app/entities/company/company.service';
import { IDepartment } from 'app/shared/model/department.model';
import { DepartmentService } from 'app/entities/department/department.service';
import { IOffice } from 'app/shared/model/office.model';
import { OfficeService } from 'app/entities/office/office.service';
import { IShop } from 'app/shared/model/shop.model';
import { ShopService } from 'app/entities/shop/shop.service';

type SelectableEntity = ICompany | IDepartment | IOffice | IShop;

@Component({
  selector: 'jhi-my-account-update',
  templateUrl: './my-account-update.component.html'
})
export class MyAccountUpdateComponent implements OnInit {
  isSaving = false;
  companies: ICompany[] = [];
  departments: IDepartment[] = [];
  offices: IOffice[] = [];
  shops: IShop[] = [];

  editForm = this.fb.group({
    id: [],
    balance: [],
    type: [],
    companyI: [],
    department: [],
    office: [],
    shops: []
  });

  constructor(
    protected myAccountService: MyAccountService,
    protected companyService: CompanyService,
    protected departmentService: DepartmentService,
    protected officeService: OfficeService,
    protected shopService: ShopService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ myAccount }) => {
      this.updateForm(myAccount);

      this.companyService.query().subscribe((res: HttpResponse<ICompany[]>) => (this.companies = res.body || []));

      this.departmentService.query().subscribe((res: HttpResponse<IDepartment[]>) => (this.departments = res.body || []));

      this.officeService.query().subscribe((res: HttpResponse<IOffice[]>) => (this.offices = res.body || []));

      this.shopService.query().subscribe((res: HttpResponse<IShop[]>) => (this.shops = res.body || []));
    });
  }

  updateForm(myAccount: IMyAccount): void {
    this.editForm.patchValue({
      id: myAccount.id,
      balance: myAccount.balance,
      type: myAccount.type,
      company: myAccount.company,
      department: myAccount.department,
      office: myAccount.office,
      shops: myAccount.shops
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const myAccount = this.createFromForm();
    if (myAccount.id !== undefined) {
      this.subscribeToSaveResponse(this.myAccountService.update(myAccount));
    } else {
      this.subscribeToSaveResponse(this.myAccountService.create(myAccount));
    }
  }

  private createFromForm(): IMyAccount {
    return {
      ...new MyAccount(),
      id: this.editForm.get(['id'])!.value,
      balance: this.editForm.get(['balance'])!.value,
      type: this.editForm.get(['type'])!.value,
      company: this.editForm.get(['company'])!.value,
      department: this.editForm.get(['department'])!.value,
      office: this.editForm.get(['office'])!.value,
      shops: this.editForm.get(['shops'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMyAccount>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackById(index: number, item: SelectableEntity): any {
    return item.id;
  }

  getSelected(selectedVals: IShop[], option: IShop): IShop {
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
