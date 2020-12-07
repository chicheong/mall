import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MallSharedModule } from 'app/shared/shared.module';
import { OrderShopComponent } from './order-shop.component';
import { OrderShopDetailComponent } from './order-shop-detail.component';
import { OrderShopUpdateComponent } from './order-shop-update.component';
import { OrderShopDeleteDialogComponent } from './order-shop-delete-dialog.component';
import { orderShopRoute } from './order-shop.route';

@NgModule({
  imports: [MallSharedModule, RouterModule.forChild(orderShopRoute)],
  declarations: [OrderShopComponent, OrderShopDetailComponent, OrderShopUpdateComponent, OrderShopDeleteDialogComponent],
  entryComponents: [OrderShopDeleteDialogComponent]
})
export class MallOrderShopModule {}
