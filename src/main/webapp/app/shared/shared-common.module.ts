import { NgModule } from '@angular/core';

import { MallSharedLibsModule, FindLanguageFromKeyPipe, StringEllipsisPipe, JhiAlertComponent, JhiAlertErrorComponent } from './';

@NgModule({
    imports: [MallSharedLibsModule],
    declarations: [FindLanguageFromKeyPipe, JhiAlertComponent, StringEllipsisPipe, JhiAlertErrorComponent],
    exports: [MallSharedLibsModule, FindLanguageFromKeyPipe, StringEllipsisPipe, JhiAlertComponent, JhiAlertErrorComponent]
})
export class MallSharedCommonModule {}
