import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';

import { NgbDateMomentAdapter } from './util/datepicker-adapter';
import { MallSharedLibsModule, MallSharedCommonModule, JhiLoginModalComponent, HasAnyAuthorityDirective } from './';
import { FileUploadDialogComponent } from './file-upload/file-upload-dialog.component';
import { FileUploadComponent } from './file-upload/file-upload.component';

@NgModule({
    imports: [MallSharedLibsModule, MallSharedCommonModule],
    declarations: [JhiLoginModalComponent, HasAnyAuthorityDirective, FileUploadDialogComponent, FileUploadComponent],
    providers: [{ provide: NgbDateAdapter, useClass: NgbDateMomentAdapter }],
    entryComponents: [JhiLoginModalComponent, FileUploadDialogComponent, FileUploadComponent],
    exports: [MallSharedCommonModule, JhiLoginModalComponent, HasAnyAuthorityDirective],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MallSharedModule {
    static forRoot() {
        return {
            ngModule: MallSharedModule
        };
    }
}
