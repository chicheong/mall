import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IMyState, MyState } from 'app/shared/model/my-state.model';
import { MyStateService } from './my-state.service';
import { ICountry } from 'app/shared/model/country.model';
import { CountryService } from 'app/entities/country/country.service';

@Component({
  selector: 'jhi-my-state-update',
  templateUrl: './my-state-update.component.html'
})
export class MyStateUpdateComponent implements OnInit {
  isSaving = false;
  countries: ICountry[] = [];

  editForm = this.fb.group({
    id: [],
    code: [null, [Validators.required, Validators.maxLength(2)]],
    label: [null, [Validators.maxLength(3)]],
    name: [null, [Validators.maxLength(100)]],
    country: []
  });

  constructor(
    protected myStateService: MyStateService,
    protected countryService: CountryService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ myState }) => {
      this.updateForm(myState);

      this.countryService.query().subscribe((res: HttpResponse<ICountry[]>) => (this.countries = res.body || []));
    });
  }

  updateForm(myState: IMyState): void {
    this.editForm.patchValue({
      id: myState.id,
      code: myState.code,
      label: myState.label,
      name: myState.name,
      country: myState.country
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const myState = this.createFromForm();
    if (myState.id !== undefined) {
      this.subscribeToSaveResponse(this.myStateService.update(myState));
    } else {
      this.subscribeToSaveResponse(this.myStateService.create(myState));
    }
  }

  private createFromForm(): IMyState {
    return {
      ...new MyState(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      label: this.editForm.get(['label'])!.value,
      name: this.editForm.get(['name'])!.value,
      country: this.editForm.get(['country'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMyState>>): void {
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

  trackById(index: number, item: ICountry): any {
    return item.id;
  }
}
