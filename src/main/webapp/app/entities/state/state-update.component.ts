import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IState } from 'app/shared/model/state.model';
import { StateService } from './state.service';
import { ICountry } from 'app/shared/model/country.model';
import { CountryService } from 'app/entities/country';

@Component({
    selector: 'jhi-state-update',
    templateUrl: './state-update.component.html'
})
export class StateUpdateComponent implements OnInit {
    state: IState;
    isSaving: boolean;

    countries: ICountry[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected stateService: StateService,
        protected countryService: CountryService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ state }) => {
            this.state = state;
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
        if (this.state.id !== undefined) {
            this.subscribeToSaveResponse(this.stateService.update(this.state));
        } else {
            this.subscribeToSaveResponse(this.stateService.create(this.state));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IState>>) {
        result.subscribe((res: HttpResponse<IState>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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
