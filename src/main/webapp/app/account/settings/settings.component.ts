import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { JhiLanguageService } from 'ng-jhipster';

import { Principal, AccountService, JhiLanguageHelper } from '../../shared';
import { Shop, ShopService } from '../../entities/shop';

@Component({
    selector: 'jhi-settings',
    templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit {

    error: string;
    success: string;
    settingsAccount: any;
    isSavingBasic: boolean;
    isEditingBasic: boolean;
    languages: any[];

    constructor(
        private account: AccountService,
        private shopService: ShopService,
        private principal: Principal,
        private languageService: JhiLanguageService,
        private languageHelper: JhiLanguageHelper
    ) {
    }

    ngOnInit() {
        this.principal.identity().then((account) => {
            this.settingsAccount = this.copyAccount(account);
        });
        this.languageHelper.getAll().then((languages) => {
            this.languages = languages;
        });
        this.isSavingBasic = false;
        this.isEditingBasic = false;
    }

    saveBasic() {
        this.isSavingBasic = true;
        this.account.save(this.settingsAccount).subscribe(() => {
            this.error = null;
            this.success = 'OK';
            this.principal.identity(true).then((account) => {
                this.settingsAccount = this.copyAccount(account);
            });
            this.languageService.getCurrent().then((current) => {
                if (this.settingsAccount.langKey !== current) {
                    this.languageService.changeLanguage(this.settingsAccount.langKey);
                }
            });
            this.isSavingBasic = false;
            this.isEditingBasic = false;
        }, () => {
            this.success = null;
            this.error = 'ERROR';
        });
    }

    createMyShop() {
        console.log('createMyShop');
        const shop: Shop = Object.assign(new Shop());
        shop.code = 'temp';
        this.shopService.create(shop)
            .subscribe((shopResponse: HttpResponse<Shop>) => {
                console.log(shopResponse.body);
            }, (res: HttpErrorResponse) => this.error = 'ERROR');
    }

    copyAccount(account) {
        return {
            activated: account.activated,
            email: account.email,
            firstName: account.firstName,
            langKey: account.langKey,
            lastName: account.lastName,
            login: account.login,
            imageUrl: account.imageUrl
        };
    }
}
