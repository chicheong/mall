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
    UuidService,
    HomeBannerComponent,
    BannerService
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
        HasAnyAuthorityDirective,
        HomeBannerComponent
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
        UuidService,
        BannerService
    ],
    entryComponents: [
        JhiLoginModalComponent,
        FileUploadDialogComponent
    ],
    exports: [
        MallSharedCommonModule,
        DraggableModule,
        JhiLoginModalComponent,
        FileUploadDialogComponent,
        HasAnyAuthorityDirective,
        DatePipe,
        HomeBannerComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class MallSharedModule {}
