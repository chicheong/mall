import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DatePipe } from '@angular/common';

import {
    MallSharedLibsModule,
    MallSharedCommonModule,
    DraggableModule,
    CSRFService,
    AuthServerProvider,
    AccountService,
    UserService,
    StateStorageService,
    LoginService,
    LoginModalService,
    JhiLoginModalComponent,
    Principal,
    HasAnyAuthorityDirective,
    FileUploadModelService,
    FileUploadDialogComponent,
    FileUploadComponent,
    PermissionService,
    UuidService
} from './';

@NgModule({
    imports: [
        MallSharedLibsModule,
        MallSharedCommonModule,
        DraggableModule
    ],
    declarations: [
        JhiLoginModalComponent,
        FileUploadDialogComponent,
        FileUploadComponent,
        HasAnyAuthorityDirective
    ],
    providers: [
        LoginService,
        LoginModalService,
        AccountService,
        StateStorageService,
        Principal,
        CSRFService,
        AuthServerProvider,
        UserService,
        DatePipe,
        FileUploadModelService,
        PermissionService,
        UuidService
    ],
    entryComponents: [
        JhiLoginModalComponent,
        FileUploadDialogComponent,
        FileUploadComponent
    ],
    exports: [
        MallSharedCommonModule,
        DraggableModule,
        JhiLoginModalComponent,
        FileUploadDialogComponent,
        FileUploadComponent,
        HasAnyAuthorityDirective,
        DatePipe
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class MallSharedModule {}
