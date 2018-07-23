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
        UuidService,
        BannerService
    ],
    entryComponents: [JhiLoginModalComponent],
    exports: [
        MallSharedCommonModule,
        DraggableModule,
        JhiLoginModalComponent,
        HasAnyAuthorityDirective,
        DatePipe,
        HomeBannerComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class MallSharedModule {}
