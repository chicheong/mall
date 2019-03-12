import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { JhiLanguageService, JhiEventManager } from 'ng-jhipster';
import { Subscription } from 'rxjs/Subscription';

import { Principal, AccountService, JhiLanguageHelper, FileUploadModelService } from '../../shared';
import { Shop, ShopService } from '../../entities/shop';
import { Url, UrlService } from '../../entities/url';

import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

export const enum SettingsComponentUploadType {
    USERIMAGE = 'userImageModification',
    USERFILE = 'userFileModification',
}
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
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    modalRef: NgbModalRef;

    constructor(
        private account: AccountService,
        private shopService: ShopService,
        private urlService: UrlService,
        private principal: Principal,
        private languageService: JhiLanguageService,
        private languageHelper: JhiLanguageHelper,
        private uploadMediaModelService: FileUploadModelService,
        private eventManager: JhiEventManager
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
        this.registerChangeInUserImage();
        this.registerChangeInUserFile();
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

    editBasic() {
        this.isEditingBasic = true;
    }

    cancelBasic() {
        this.isEditingBasic = false;
        this.principal.identity().then((account) => {
            this.settingsAccount = this.copyAccount(account);
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

    registerChangeInUserImage() {
        this.eventSubscriber = this.eventManager.subscribe(
            SettingsComponentUploadType.USERIMAGE,
            (response) => this.updateUserImage(response.obj)
        );
    }

    registerChangeInUserFile() {
        this.eventSubscriber = this.eventManager.subscribe(
            SettingsComponentUploadType.USERFILE,
            (response) => this.updateUserFile(response.obj)
        );
    }

    updateUserImage(urls: Url[]) {
        this.settingsAccount.imageUrl = urls[0].path;
    }

    updateUserFile(urls: Url[]) {
        this.urlService.createMultiple(urls).subscribe((urlsResponse: HttpResponse<Url[]>) => {
            console.log(urlsResponse.body);
        }, (res: HttpErrorResponse) => this.error = 'ERROR');
    }

    uploadUserImage() {
        this.modalRef = this.uploadMediaModelService.open(null, null, 1, null, SettingsComponentUploadType.USERIMAGE);
    }

    uploadFile() {
        const url = new Url();
        url.entityType = 'User';
        url.entityId = 1;
        url.sequence = 1;
        this.modalRef = this.uploadMediaModelService.open(url, null, null, null, SettingsComponentUploadType.USERFILE);
    }
}
