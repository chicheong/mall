import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DatePipe } from '@angular/common';

import {
    MallSharedLibsModule,
    MallSharedCommonModule,
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
    UuidService,
    FileUploadComponent
} from './';

@NgModule({
    imports: [
        MallSharedLibsModule,
        MallSharedCommonModule
    ],
    declarations: [
        JhiLoginModalComponent,
        HasAnyAuthorityDirective,
        FileUploadComponent
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
        UuidService
    ],
    entryComponents: [JhiLoginModalComponent],
    exports: [
        MallSharedCommonModule,
        JhiLoginModalComponent,
        HasAnyAuthorityDirective,
        DatePipe,
        FileUploadComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class MallSharedModule {}
