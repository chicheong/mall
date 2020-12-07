import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IOffice, Office } from 'app/shared/model/office.model';
import { OfficeService } from './office.service';
import { IAddress } from 'app/shared/model/address.model';
import { AddressService } from 'app/entities/address/address.service';

@Component({
  selector: 'jhi-office-update',
  templateUrl: './office-update.component.html'
})
export class OfficeUpdateComponent implements OnInit {
  isSaving = false;
  addresses: IAddress[] = [];

  editForm = this.fb.group({
    id: [],
    code: [null, [Validators.required]],
    name: [],
    status: [],
    address: []
  });

  constructor(
    protected officeService: OfficeService,
    protected addressService: AddressService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ office }) => {
      this.updateForm(office);

      this.addressService
        .query({ filter: 'office-is-null' })
        .pipe(
          map((res: HttpResponse<IAddress[]>) => {
            return res.body || [];
          })
        )
        .subscribe((resBody: IAddress[]) => {
          if (!office.address || !office.address.id) {
            this.addresses = resBody;
          } else {
            this.addressService
              .find(office.address.id)
              .pipe(
                map((subRes: HttpResponse<IAddress>) => {
                  return subRes.body ? [subRes.body].concat(resBody) : resBody;
                })
              )
              .subscribe((concatRes: IAddress[]) => (this.addresses = concatRes));
          }
        });
    });
  }

  updateForm(office: IOffice): void {
    this.editForm.patchValue({
      id: office.id,
      code: office.code,
      name: office.name,
      status: office.status,
      address: office.address
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const office = this.createFromForm();
    if (office.id !== undefined) {
      this.subscribeToSaveResponse(this.officeService.update(office));
    } else {
      this.subscribeToSaveResponse(this.officeService.create(office));
    }
  }

  private createFromForm(): IOffice {
    return {
      ...new Office(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      name: this.editForm.get(['name'])!.value,
      status: this.editForm.get(['status'])!.value,
      address: this.editForm.get(['address'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOffice>>): void {
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

  trackById(index: number, item: IAddress): any {
    return item.id;
  }
}
