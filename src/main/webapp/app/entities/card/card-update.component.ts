import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { ICard, Card } from 'app/shared/model/card.model';
import { CardService } from './card.service';
import { IMyAccount } from 'app/shared/model/my-account.model';
import { MyAccountService } from 'app/entities/my-account/my-account.service';

@Component({
  selector: 'jhi-card-update',
  templateUrl: './card-update.component.html'
})
export class CardUpdateComponent implements OnInit {
  isSaving = false;
  myaccounts: IMyAccount[] = [];

  editForm = this.fb.group({
    id: [],
    holderName: [],
    cardNumber: [],
    expirationMonth: [],
    expirationYear: [],
    cvc: [],
    account: []
  });

  constructor(
    protected cardService: CardService,
    protected myAccountService: MyAccountService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ card }) => {
      this.updateForm(card);

      this.myAccountService.query().subscribe((res: HttpResponse<IMyAccount[]>) => (this.myaccounts = res.body || []));
    });
  }

  updateForm(card: ICard): void {
    this.editForm.patchValue({
      id: card.id,
      holderName: card.holderName,
      cardNumber: card.cardNumber,
      expirationMonth: card.expirationMonth,
      expirationYear: card.expirationYear,
      cvc: card.cvc,
      account: card.account
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const card = this.createFromForm();
    if (card.id !== undefined) {
      this.subscribeToSaveResponse(this.cardService.update(card));
    } else {
      this.subscribeToSaveResponse(this.cardService.create(card));
    }
  }

  private createFromForm(): ICard {
    return {
      ...new Card(),
      id: this.editForm.get(['id'])!.value,
      holderName: this.editForm.get(['holderName'])!.value,
      cardNumber: this.editForm.get(['cardNumber'])!.value,
      expirationMonth: this.editForm.get(['expirationMonth'])!.value,
      expirationYear: this.editForm.get(['expirationYear'])!.value,
      cvc: this.editForm.get(['cvc'])!.value,
      account: this.editForm.get(['account'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICard>>): void {
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

  trackByObject(index: number, item: IMyAccount): any {
    return item;
  }
}
