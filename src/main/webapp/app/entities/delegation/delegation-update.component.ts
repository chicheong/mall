import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';
import { IDelegation } from 'app/shared/model/delegation.model';
import { DelegationService } from './delegation.service';
import { IMyAccount } from 'app/shared/model/my-account.model';
import { MyAccountService } from 'app/entities/my-account';

@Component({
    selector: 'jhi-delegation-update',
    templateUrl: './delegation-update.component.html'
})
export class DelegationUpdateComponent implements OnInit {
    delegation: IDelegation;
    isSaving: boolean;

    myaccounts: IMyAccount[];
    from: string;
    to: string;
    createdDate: string;
    lastModifiedDate: string;

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected delegationService: DelegationService,
        protected myAccountService: MyAccountService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ delegation }) => {
            this.delegation = delegation;
            this.from = this.delegation.from != null ? this.delegation.from.format(DATE_TIME_FORMAT) : null;
            this.to = this.delegation.to != null ? this.delegation.to.format(DATE_TIME_FORMAT) : null;
            this.createdDate = this.delegation.createdDate != null ? this.delegation.createdDate.format(DATE_TIME_FORMAT) : null;
            this.lastModifiedDate =
                this.delegation.lastModifiedDate != null ? this.delegation.lastModifiedDate.format(DATE_TIME_FORMAT) : null;
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
        this.delegation.from = this.from != null ? moment(this.from, DATE_TIME_FORMAT) : null;
        this.delegation.to = this.to != null ? moment(this.to, DATE_TIME_FORMAT) : null;
        this.delegation.createdDate = this.createdDate != null ? moment(this.createdDate, DATE_TIME_FORMAT) : null;
        this.delegation.lastModifiedDate = this.lastModifiedDate != null ? moment(this.lastModifiedDate, DATE_TIME_FORMAT) : null;
        if (this.delegation.id !== undefined) {
            this.subscribeToSaveResponse(this.delegationService.update(this.delegation));
        } else {
            this.subscribeToSaveResponse(this.delegationService.create(this.delegation));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IDelegation>>) {
        result.subscribe((res: HttpResponse<IDelegation>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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
