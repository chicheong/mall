import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { JhiLanguageService, JhiEventManager } from 'ng-jhipster';
import { Subscription } from 'rxjs';

import { AccountService, JhiLanguageHelper } from 'app/core';
import { IShop, Shop } from 'app/shared/model/shop.model';
import { ShopService } from 'app/entities/shop';
import { IUrl, Url } from 'app/shared/model/url.model';
import { UrlService } from 'app/entities/url';
import { FileUploadModelService } from 'app/shared';

import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

export const enum SettingsComponentUploadType {
    USER_IMAGE = 'userImageModification',
    USER_FILE = 'userFileModification',
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
        private accountService: AccountService,
        private shopService: ShopService,
        private urlService: UrlService,
        private languageService: JhiLanguageService,
        private languageHelper: JhiLanguageHelper,
        private uploadMediaModelService: FileUploadModelService,
        private eventManager: JhiEventManager
    ) {}

    ngOnInit() {
        this.accountService.identity().then(account => {
            this.settingsAccount = this.copyAccount(account);
        });
        this.languageHelper.getAll().then(languages => {
            this.languages = languages;
        });
        this.isSavingBasic = false;
        this.isEditingBasic = false;
        this.registerChangeInUserImage();
        this.registerChangeInUserFile();
    }

    saveBasic() {
        this.isSavingBasic = true;
        this.accountService.save(this.settingsAccount).subscribe(
            () => {
                this.error = null;
                this.success = 'OK';
                this.accountService.identity(true).then(account => {
                    this.settingsAccount = this.copyAccount(account);
                });
                this.languageService.getCurrent().then(current => {
                    if (this.settingsAccount.langKey !== current) {
                        this.languageService.changeLanguage(this.settingsAccount.langKey);
                    }
                });
                this.isSavingBasic = false;
                this.isEditingBasic = false;
            },
            () => {
                this.success = null;
                this.error = 'ERROR';
            }
        );
    }

    editBasic() {
        this.isEditingBasic = true;
    }

    cancelBasic() {
        this.isEditingBasic = false;
        this.accountService.identity().then(account => {
            this.settingsAccount = this.copyAccount(account);
        });
    }

    createMyShop() {
        console.log('createMyShop');
        const shop: IShop = Object.assign(new Shop());
        shop.code = 'temp';
        this.shopService.create(shop)
            .subscribe((shopResponse: HttpResponse<IShop>) => {
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
            SettingsComponentUploadType.USER_IMAGE,
            response => this.updateUserImage(response.obj)
        );
    }

    registerChangeInUserFile() {
        this.eventSubscriber = this.eventManager.subscribe(
            SettingsComponentUploadType.USER_FILE,
            response => this.updateUserFile(response.obj)
        );
    }

    updateUserImage(urls: IUrl[]) {
        this.settingsAccount.imageUrl = urls[0].path;
    }

    updateUserFile(urls: IUrl[]) {
        this.urlService.createMultiple(urls).subscribe((urlsResponse: HttpResponse<IUrl[]>) => {
            console.log(urlsResponse.body);
        }, (res: HttpErrorResponse) => this.error = 'ERROR');
    }

    uploadUserImage() {
        this.modalRef = this.uploadMediaModelService.open(null, null, 1, null, SettingsComponentUploadType.USER_IMAGE);
    }

    uploadFile() {
        const url = new Url();
        url.entityType = 'User';
        url.entityId = 1;
        url.sequence = 1;
        this.modalRef = this.uploadMediaModelService.open(url, null, null, null, SettingsComponentUploadType.USER_FILE);
    }
}
