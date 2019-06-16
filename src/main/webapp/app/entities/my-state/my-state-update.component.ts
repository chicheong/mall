import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IMyState } from 'app/shared/model/my-state.model';
import { MyStateService } from './my-state.service';
import { ICountry } from 'app/shared/model/country.model';
import { CountryService } from 'app/entities/country';

@Component({
    selector: 'jhi-my-state-update',
    templateUrl: './my-state-update.component.html'
})
export class MyStateUpdateComponent implements OnInit {
    myState: IMyState;
    isSaving: boolean;

    countries: ICountry[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected myStateService: MyStateService,
        protected countryService: CountryService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ myState }) => {
            this.myState = myState;
        });
        this.countryService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<ICountry[]>) => mayBeOk.ok),
                map((response: HttpResponse<ICountry[]>) => response.body)
            )
            .subscribe((res: ICountry[]) => (this.countries = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.myState.id !== undefined) {
            this.subscribeToSaveResponse(this.myStateService.update(this.myState));
        } else {
            this.subscribeToSaveResponse(this.myStateService.create(this.myState));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IMyState>>) {
        result.subscribe((res: HttpResponse<IMyState>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackCountryById(index: number, item: ICountry) {
        return item.id;
    }
}
