import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IAddress, Address } from 'app/shared/model/address.model';
import { AddressService } from './address.service';
import { ICountry } from 'app/shared/model/country.model';
import { CountryService } from 'app/entities/country/country.service';
import { IMyState } from 'app/shared/model/my-state.model';
import { MyStateService } from 'app/entities/my-state/my-state.service';

type SelectableEntity = ICountry | IMyState;

@Component({
  selector: 'jhi-address-update',
  templateUrl: './address-update.component.html'
})
export class AddressUpdateComponent implements OnInit {
  isSaving = false;
  countries: ICountry[] = [];
  mystates: IMyState[] = [];

  editForm = this.fb.group({
    id: [],
    line1: [],
    line2: [],
    line3: [],
    line4: [],
    city: [],
    postalCode: [],
    country: [],
    myState: []
  });

  constructor(
    protected addressService: AddressService,
    protected countryService: CountryService,
    protected myStateService: MyStateService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ address }) => {
      this.updateForm(address);

      this.countryService.query().subscribe((res: HttpResponse<ICountry[]>) => (this.countries = res.body || []));

      this.myStateService.query().subscribe((res: HttpResponse<IMyState[]>) => (this.mystates = res.body || []));
    });
  }

  updateForm(address: IAddress): void {
    this.editForm.patchValue({
      id: address.id,
      line1: address.line1,
      line2: address.line2,
      line3: address.line3,
      line4: address.line4,
      city: address.city,
      postalCode: address.postalCode,
      country: address.country,
      myState: address.myState
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const address = this.createFromForm();
    if (address.id !== undefined) {
      this.subscribeToSaveResponse(this.addressService.update(address));
    } else {
      this.subscribeToSaveResponse(this.addressService.create(address));
    }
  }

  private createFromForm(): IAddress {
    return {
      ...new Address(),
      id: this.editForm.get(['id'])!.value,
      line1: this.editForm.get(['line1'])!.value,
      line2: this.editForm.get(['line2'])!.value,
      line3: this.editForm.get(['line3'])!.value,
      line4: this.editForm.get(['line4'])!.value,
      city: this.editForm.get(['city'])!.value,
      postalCode: this.editForm.get(['postalCode'])!.value,
      country: this.editForm.get(['country'])!.value,
      myState: this.editForm.get(['myState'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAddress>>): void {
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

  trackByObject(index: number, item: SelectableEntity): any {
    return item;
  }
}
