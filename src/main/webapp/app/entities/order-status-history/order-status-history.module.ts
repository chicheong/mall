import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MallSharedModule } from 'app/shared/shared.module';
import { OrderStatusHistoryComponent } from './order-status-history.component';
import { OrderStatusHistoryDetailComponent } from './order-status-history-detail.component';
import { OrderStatusHistoryUpdateComponent } from './order-status-history-update.component';
import { OrderStatusHistoryDeleteDialogComponent } from './order-status-history-delete-dialog.component';
import { orderStatusHistoryRoute } from './order-status-history.route';

@NgModule({
  imports: [MallSharedModule, RouterModule.forChild(orderStatusHistoryRoute)],
  declarations: [
    OrderStatusHistoryComponent,
    OrderStatusHistoryDetailComponent,
    OrderStatusHistoryUpdateComponent,
    OrderStatusHistoryDeleteDialogComponent
  ],
  entryComponents: [OrderStatusHistoryDeleteDialogComponent]
})
export class MallOrderStatusHistoryModule {}
