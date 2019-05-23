import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { ICard } from 'app/shared/model/card.model';
import { CardService } from './card.service';
import { IMyAccount } from 'app/shared/model/my-account.model';
import { MyAccountService } from 'app/entities/my-account';

@Component({
    selector: 'jhi-card-update',
    templateUrl: './card-update.component.html'
})
export class CardUpdateComponent implements OnInit {
    card: ICard;
    isSaving: boolean;

    myaccounts: IMyAccount[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected cardService: CardService,
        protected myAccountService: MyAccountService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ card }) => {
            this.card = card;
        });
        this.myAccountService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IMyAccount[]>) => mayBeOk.ok),
                map((response: HttpResponse<IMyAccount[]>) => response.body)
            )
            .subscribe((res: IMyAccount[]) => (this.myaccounts = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.card.id !== undefined) {
            this.subscribeToSaveResponse(this.cardService.update(this.card));
        } else {
            this.subscribeToSaveResponse(this.cardService.create(this.card));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<ICard>>) {
        result.subscribe((res: HttpResponse<ICard>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackMyAccountById(index: number, item: IMyAccount) {
        return item.id;
    }
}
