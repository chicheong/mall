import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { UserInfo } from './user-info.model';
import { UserInfoPopupService } from './user-info-popup.service';
import { UserInfoService } from './user-info.service';
import { User, UserService } from '../../shared';
import { MyAccount, MyAccountService } from '../my-account';
import { ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-user-info-dialog',
    templateUrl: './user-info-dialog.component.html'
})
export class UserInfoDialogComponent implements OnInit {

    userInfo: UserInfo;
    isSaving: boolean;

    users: User[];

    myaccounts: MyAccount[];

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private userInfoService: UserInfoService,
        private userService: UserService,
        private myAccountService: MyAccountService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.userService.query()
            .subscribe((res: ResponseWrapper) => { this.users = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
        this.myAccountService.query()
            .subscribe((res: ResponseWrapper) => { this.myaccounts = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.userInfo.id !== undefined) {
            this.subscribeToSaveResponse(
                this.userInfoService.update(this.userInfo));
        } else {
            this.subscribeToSaveResponse(
                this.userInfoService.create(this.userInfo));
        }
    }

    private subscribeToSaveResponse(result: Observable<UserInfo>) {
        result.subscribe((res: UserInfo) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: UserInfo) {
        this.eventManager.broadcast({ name: 'userInfoListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError(error) {
        try {
            error.json();
        } catch (exception) {
            error.message = error.text();
        }
        this.isSaving = false;
        this.onError(error);
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }

    trackUserById(index: number, item: User) {
        return item.id;
    }

    trackMyAccountById(index: number, item: MyAccount) {
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

@Component({
    selector: 'jhi-user-info-popup',
    template: ''
})
export class UserInfoPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private userInfoPopupService: UserInfoPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.userInfoPopupService
                    .open(UserInfoDialogComponent as Component, params['id']);
            } else {
                this.userInfoPopupService
                    .open(UserInfoDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
