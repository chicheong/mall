import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MallSharedModule } from 'app/shared/shared.module';
import { MyOrderComponent } from './my-order.component';
import { MyOrderDetailComponent } from './my-order-detail.component';
import { MyOrderUpdateComponent } from './my-order-update.component';
import { MyOrderDeleteDialogComponent } from './my-order-delete-dialog.component';
import { CartPendingComponent } from './cart/cart-pending.component';
import { CheckoutComponent } from './checkout.component';
import { myOrderRoute } from './my-order.route';

@NgModule({
  imports: [MallSharedModule, RouterModule.forChild(myOrderRoute)],
  declarations: [
    MyOrderComponent, 
    MyOrderDetailComponent, 
    MyOrderUpdateComponent, 
    MyOrderDeleteDialogComponent,
    CartPendingComponent,
    CheckoutComponent
  ],
  entryComponents: [MyOrderDeleteDialogComponent]
})
export class MallMyOrderModule {}
