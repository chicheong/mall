import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import './vendor';
import { MallSharedModule } from 'app/shared/shared.module';
import { MallCoreModule } from 'app/core/core.module';
import { MallAppRoutingModule } from './app-routing.module';
import { MallHomeModule } from './home/home.module';
import { MallEntityModule } from './entities/entity.module';
// jhipster-needle-angular-add-module-import JHipster will add new module here
import { MainComponent } from './layouts/main/main.component';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { PageRibbonComponent } from './layouts/profiles/page-ribbon.component';
import { ActiveMenuDirective } from './layouts/navbar/active-menu.directive';
import { ErrorComponent } from './layouts/error/error.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MallSharedModule,
    MallCoreModule,
    MallHomeModule,
    // jhipster-needle-angular-add-module JHipster will add new module here
    MallEntityModule,
    MallAppRoutingModule
  ],
  declarations: [MainComponent, NavbarComponent, ErrorComponent, PageRibbonComponent, ActiveMenuDirective, FooterComponent],
  bootstrap: [MainComponent]
})
export class MallAppModule {}
