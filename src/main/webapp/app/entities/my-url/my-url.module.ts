import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MallSharedModule } from 'app/shared/shared.module';
import { MyUrlComponent } from './my-url.component';
import { MyUrlDetailComponent } from './my-url-detail.component';
import { MyUrlUpdateComponent } from './my-url-update.component';
import { MyUrlDeleteDialogComponent } from './my-url-delete-dialog.component';
import { urlRoute } from './my-url.route';

@NgModule({
  imports: [MallSharedModule, RouterModule.forChild(urlRoute)],
  declarations: [MyUrlComponent, MyUrlDetailComponent, MyUrlUpdateComponent, MyUrlDeleteDialogComponent],
  entryComponents: [MyUrlDeleteDialogComponent]
})
export class MallMyUrlModule {}
