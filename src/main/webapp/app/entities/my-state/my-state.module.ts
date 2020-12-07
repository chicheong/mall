import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MallSharedModule } from 'app/shared/shared.module';
import { MyStateComponent } from './my-state.component';
import { MyStateDetailComponent } from './my-state-detail.component';
import { MyStateUpdateComponent } from './my-state-update.component';
import { MyStateDeleteDialogComponent } from './my-state-delete-dialog.component';
import { myStateRoute } from './my-state.route';

@NgModule({
  imports: [MallSharedModule, RouterModule.forChild(myStateRoute)],
  declarations: [MyStateComponent, MyStateDetailComponent, MyStateUpdateComponent, MyStateDeleteDialogComponent],
  entryComponents: [MyStateDeleteDialogComponent]
})
export class MallMyStateModule {}
