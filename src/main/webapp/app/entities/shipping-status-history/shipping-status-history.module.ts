import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MallSharedModule } from 'app/shared/shared.module';
import { ShippingStatusHistoryComponent } from './shipping-status-history.component';
import { ShippingStatusHistoryDetailComponent } from './shipping-status-history-detail.component';
import { ShippingStatusHistoryUpdateComponent } from './shipping-status-history-update.component';
import { ShippingStatusHistoryDeleteDialogComponent } from './shipping-status-history-delete-dialog.component';
import { shippingStatusHistoryRoute } from './shipping-status-history.route';

@NgModule({
  imports: [MallSharedModule, RouterModule.forChild(shippingStatusHistoryRoute)],
  declarations: [
    ShippingStatusHistoryComponent,
    ShippingStatusHistoryDetailComponent,
    ShippingStatusHistoryUpdateComponent,
    ShippingStatusHistoryDeleteDialogComponent
  ],
  entryComponents: [ShippingStatusHistoryDeleteDialogComponent]
})
export class MallShippingStatusHistoryModule {}
