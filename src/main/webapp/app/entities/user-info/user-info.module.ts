import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MallSharedModule } from 'app/shared/shared.module';
import { UserInfoComponent } from './user-info.component';
import { UserInfoDetailComponent } from './user-info-detail.component';
import { UserInfoUpdateComponent } from './user-info-update.component';
import { UserInfoDeleteDialogComponent } from './user-info-delete-dialog.component';
import { userInfoRoute } from './user-info.route';

@NgModule({
  imports: [MallSharedModule, RouterModule.forChild(userInfoRoute)],
  declarations: [UserInfoComponent, UserInfoDetailComponent, UserInfoUpdateComponent, UserInfoDeleteDialogComponent],
  entryComponents: [UserInfoDeleteDialogComponent]
})
export class MallUserInfoModule {}
