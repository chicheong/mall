import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MallSharedModule } from 'app/shared/shared.module';
import { PaymentStatusHistoryComponent } from './payment-status-history.component';
import { PaymentStatusHistoryDetailComponent } from './payment-status-history-detail.component';
import { PaymentStatusHistoryUpdateComponent } from './payment-status-history-update.component';
import { PaymentStatusHistoryDeleteDialogComponent } from './payment-status-history-delete-dialog.component';
import { paymentStatusHistoryRoute } from './payment-status-history.route';

@NgModule({
  imports: [MallSharedModule, RouterModule.forChild(paymentStatusHistoryRoute)],
  declarations: [
    PaymentStatusHistoryComponent,
    PaymentStatusHistoryDetailComponent,
    PaymentStatusHistoryUpdateComponent,
    PaymentStatusHistoryDeleteDialogComponent
  ],
  entryComponents: [PaymentStatusHistoryDeleteDialogComponent]
})
export class MallPaymentStatusHistoryModule {}
