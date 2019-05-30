import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IUserInfo } from 'app/shared/model/user-info.model';
import { UserInfoService } from './user-info.service';
import { IUser, UserService } from 'app/core';
import { IMyAccount } from 'app/shared/model/my-account.model';
import { MyAccountService } from 'app/entities/my-account';

@Component({
    selector: 'jhi-user-info-update',
    templateUrl: './user-info-update.component.html'
})
export class UserInfoUpdateComponent implements OnInit {
    userInfo: IUserInfo;
    isSaving: boolean;

    users: IUser[];

    defaultaccounts: IMyAccount[];

    myaccounts: IMyAccount[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected userInfoService: UserInfoService,
        protected userService: UserService,
        protected myAccountService: MyAccountService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ userInfo }) => {
            this.userInfo = userInfo;
        });
        this.userService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IUser[]>) => mayBeOk.ok),
                map((response: HttpResponse<IUser[]>) => response.body)
            )
            .subscribe((res: IUser[]) => (this.users = res), (res: HttpErrorResponse) => this.onError(res.message));
        this.myAccountService
            .query({ filter: 'userinfo-is-null' })
            .pipe(
                filter((mayBeOk: HttpResponse<IMyAccount[]>) => mayBeOk.ok),
                map((response: HttpResponse<IMyAccount[]>) => response.body)
            )
            .subscribe(
                (res: IMyAccount[]) => {
                    if (!this.userInfo.defaultAccount) {
                        this.defaultaccounts = res;
                    } else {
                        this.myAccountService
                            .find(this.userInfo.defaultAccount.id)
                            .pipe(
                                filter((subResMayBeOk: HttpResponse<IMyAccount>) => subResMayBeOk.ok),
                                map((subResponse: HttpResponse<IMyAccount>) => subResponse.body)
                            )
                            .subscribe(
                                (subRes: IMyAccount) => (this.defaultaccounts = [subRes].concat(res)),
                                (subRes: HttpErrorResponse) => this.onError(subRes.message)
                            );
                    }
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
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
        if (this.userInfo.id !== undefined) {
            this.subscribeToSaveResponse(this.userInfoService.update(this.userInfo));
        } else {
            this.subscribeToSaveResponse(this.userInfoService.create(this.userInfo));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserInfo>>) {
        result.subscribe((res: HttpResponse<IUserInfo>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackUserById(index: number, item: IUser) {
        return item.id;
    }

    trackMyAccountById(index: number, item: IMyAccount) {
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
