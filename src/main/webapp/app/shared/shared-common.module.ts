import { NgModule, LOCALE_ID } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import locale from '@angular/common/locales/en';

import {
    MallSharedLibsModule,
    JhiLanguageHelper,
    FindLanguageFromKeyPipe,
    FormatNumberPipe,
    JhiAlertComponent,
    JhiAlertErrorComponent
} from './';

@NgModule({
    imports: [
        MallSharedLibsModule
    ],
    declarations: [
        FindLanguageFromKeyPipe,
        FormatNumberPipe,
        JhiAlertComponent,
        JhiAlertErrorComponent
    ],
    providers: [
        JhiLanguageHelper,
        Title,
        {
            provide: LOCALE_ID,
            useValue: 'en'
        },
    ],
    exports: [
        MallSharedLibsModule,
        FindLanguageFromKeyPipe,
        FormatNumberPipe,
        JhiAlertComponent,
        JhiAlertErrorComponent
    ]
})
export class MallSharedCommonModule {
    constructor() {
        registerLocaleData(locale);
    }
}
