import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IUserInfo, UserInfo } from 'app/shared/model/user-info.model';
import { UserInfoService } from './user-info.service';
import { IUser } from 'app/core/user/user.model';
import { UserService } from 'app/core/user/user.service';
import { IMyAccount } from 'app/shared/model/my-account.model';
import { MyAccountService } from 'app/entities/my-account/my-account.service';

type SelectableEntity = IUser | IMyAccount;

@Component({
  selector: 'jhi-user-info-update',
  templateUrl: './user-info-update.component.html'
})
export class UserInfoUpdateComponent implements OnInit {
  isSaving = false;
  users: IUser[] = [];
  defaultaccounts: IMyAccount[] = [];
  myaccounts: IMyAccount[] = [];

  editForm = this.fb.group({
    id: [],
    accountId: [],
    shopId: [],
    userId: [],
    defaultAccount: [],
    accounts: []
  });

  constructor(
    protected userInfoService: UserInfoService,
    protected userService: UserService,
    protected myAccountService: MyAccountService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userInfo }) => {
      this.updateForm(userInfo);

      this.userService.query().subscribe((res: HttpResponse<IUser[]>) => (this.users = res.body || []));

      this.myAccountService
        .query({ filter: 'userinfo-is-null' })
        .pipe(
          map((res: HttpResponse<IMyAccount[]>) => {
            return res.body || [];
          })
        )
        .subscribe((resBody: IMyAccount[]) => {
          if (!userInfo.defaultAccountId) {
            this.defaultaccounts = resBody;
          } else {
            this.myAccountService
              .find(userInfo.defaultAccountId)
              .pipe(
                map((subRes: HttpResponse<IMyAccount>) => {
                  return subRes.body ? [subRes.body].concat(resBody) : resBody;
                })
              )
              .subscribe((concatRes: IMyAccount[]) => (this.defaultaccounts = concatRes));
          }
        });

      this.myAccountService.query().subscribe((res: HttpResponse<IMyAccount[]>) => (this.myaccounts = res.body || []));
    });
  }

  updateForm(userInfo: IUserInfo): void {
    this.editForm.patchValue({
      id: userInfo.id,
      accountId: userInfo.accountId,
      shopId: userInfo.shopId,
      userId: userInfo.userId,
      defaultAccount: userInfo.defaultAccount,
      accounts: userInfo.accounts
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const userInfo = this.createFromForm();
    if (userInfo.id !== undefined) {
      this.subscribeToSaveResponse(this.userInfoService.update(userInfo));
    } else {
      this.subscribeToSaveResponse(this.userInfoService.create(userInfo));
    }
  }

  private createFromForm(): IUserInfo {
    return {
      ...new UserInfo(),
      id: this.editForm.get(['id'])!.value,
      accountId: this.editForm.get(['accountId'])!.value,
      shopId: this.editForm.get(['shopId'])!.value,
      userId: this.editForm.get(['userId'])!.value,
      defaultAccount: this.editForm.get(['defaultAccount'])!.value,
      accounts: this.editForm.get(['accounts'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserInfo>>): void {
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

  trackById(index: number, item: SelectableEntity): any {
    return item.id;
  }

  getSelected(selectedVals: IMyAccount[], option: IMyAccount): IMyAccount {
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
