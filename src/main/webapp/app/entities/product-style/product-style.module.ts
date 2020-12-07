import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MallSharedModule } from 'app/shared/shared.module';
import { ProductStyleComponent } from './product-style.component';
import { ProductStyleDetailComponent } from './product-style-detail.component';
import { ProductStyleUpdateComponent } from './product-style-update.component';
import { ProductStyleDeleteDialogComponent } from './product-style-delete-dialog.component';
import { productStyleRoute } from './product-style.route';

@NgModule({
  imports: [MallSharedModule, RouterModule.forChild(productStyleRoute)],
  declarations: [ProductStyleComponent, ProductStyleDetailComponent, ProductStyleUpdateComponent, ProductStyleDeleteDialogComponent],
  entryComponents: [ProductStyleDeleteDialogComponent]
})
export class MallProductStyleModule {}
