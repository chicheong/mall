import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MallSharedModule } from 'app/shared/shared.module';
import { MyAccountComponent } from './my-account.component';
import { MyAccountDetailComponent } from './my-account-detail.component';
import { MyAccountUpdateComponent } from './my-account-update.component';
import { MyAccountDeleteDialogComponent } from './my-account-delete-dialog.component';
import { myAccountRoute } from './my-account.route';

@NgModule({
  imports: [MallSharedModule, RouterModule.forChild(myAccountRoute)],
  declarations: [MyAccountComponent, MyAccountDetailComponent, MyAccountUpdateComponent, MyAccountDeleteDialogComponent],
  entryComponents: [MyAccountDeleteDialogComponent]
})
export class MallMyAccountModule {}
