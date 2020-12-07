import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MallSharedModule } from 'app/shared/shared.module';
import { PaymentCardComponent } from './payment-card.component';
import { PaymentCardDetailComponent } from './payment-card-detail.component';
import { PaymentCardUpdateComponent } from './payment-card-update.component';
import { PaymentCardDeleteDialogComponent } from './payment-card-delete-dialog.component';
import { paymentCardRoute } from './payment-card.route';

@NgModule({
  imports: [MallSharedModule, RouterModule.forChild(paymentCardRoute)],
  declarations: [PaymentCardComponent, PaymentCardDetailComponent, PaymentCardUpdateComponent, PaymentCardDeleteDialogComponent],
  entryComponents: [PaymentCardDeleteDialogComponent]
})
export class MallPaymentCardModule {}
