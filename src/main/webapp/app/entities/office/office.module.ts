import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MallSharedModule } from 'app/shared/shared.module';
import { OfficeComponent } from './office.component';
import { OfficeDetailComponent } from './office-detail.component';
import { OfficeUpdateComponent } from './office-update.component';
import { OfficeDeleteDialogComponent } from './office-delete-dialog.component';
import { officeRoute } from './office.route';

@NgModule({
  imports: [MallSharedModule, RouterModule.forChild(officeRoute)],
  declarations: [OfficeComponent, OfficeDetailComponent, OfficeUpdateComponent, OfficeDeleteDialogComponent],
  entryComponents: [OfficeDeleteDialogComponent]
})
export class MallOfficeModule {}
