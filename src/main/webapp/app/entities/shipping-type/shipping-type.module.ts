import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MallSharedModule } from 'app/shared/shared.module';
import { ShippingTypeComponent } from './shipping-type.component';
import { ShippingTypeDetailComponent } from './shipping-type-detail.component';
import { ShippingTypeUpdateComponent } from './shipping-type-update.component';
import { ShippingTypeDeleteDialogComponent } from './shipping-type-delete-dialog.component';
import { shippingTypeRoute } from './shipping-type.route';

@NgModule({
  imports: [MallSharedModule, RouterModule.forChild(shippingTypeRoute)],
  declarations: [ShippingTypeComponent, ShippingTypeDetailComponent, ShippingTypeUpdateComponent, ShippingTypeDeleteDialogComponent],
  entryComponents: [ShippingTypeDeleteDialogComponent]
})
export class MallShippingTypeModule {}
