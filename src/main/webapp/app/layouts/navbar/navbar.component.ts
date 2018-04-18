import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiLanguageService, JhiEventManager } from 'ng-jhipster';

import { ProfileService } from '../profiles/profile.service';
import { JhiLanguageHelper, Principal, LoginModalService, LoginService, User } from '../../shared';

import { Subscription } from 'rxjs/Subscription';
import { VERSION } from '../../app.constants';

import { MyAccount, MyAccountService } from '../../entities/my-account';
import { Shop } from '../../entities/shop';
import { MyOrder } from '../../entities/my-order';

@Component({
    selector: 'jhi-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: [
        'navbar.scss'
    ]
})
export class NavbarComponent implements OnInit, OnDestroy {
    inProduction: boolean;
    isNavbarCollapsed: boolean;
    languages: any[];
    swaggerEnabled: boolean;
    modalRef: NgbModalRef;
    version: string;
    eventSubscriber: Subscription;
    myAccount: MyAccount;

    constructor(
        private loginService: LoginService,
        private languageService: JhiLanguageService,
        private languageHelper: JhiLanguageHelper,
        private principal: Principal,
        private loginModalService: LoginModalService,
        private profileService: ProfileService,
        private router: Router,
        private eventManager: JhiEventManager,
        private myAccountService: MyAccountService
    ) {
        this.version = VERSION ? 'v' + VERSION : '';
        this.isNavbarCollapsed = true;
    }

    ngOnInit() {
        // console.error('navbar ngOnInit');
        this.languageHelper.getAll().then((languages) => {
            this.languages = languages;
        });

        this.profileService.getProfileInfo().then((profileInfo) => {
            this.inProduction = profileInfo.inProduction;
            this.swaggerEnabled = profileInfo.swaggerEnabled;
        });

        this.registerAuthenticationSuccess();
        // this.registerChangeInAccount();
        // console.error('check navbar Authenticated?');
        this.principal.identity().then((account) => {
            if (account) {
                this.eventManager.broadcast({
                    name: 'authenticationSuccess',
                    content: 'Sending Already Authenticated'
                });
            }
        });
    }

    registerAuthenticationSuccess() {
        this.eventManager.subscribe('authenticationSuccess', (message) => {
            // console.error('navbar registerAuthenticationSuccess');
            this.principal.identity().then((account) => {
                // console.error('navbar this.principal.identity().then');
                if (account && account.myAccount) {
                    this.myAccountService.find(account.myAccount.id).subscribe((myAccountResponse: HttpResponse<MyAccount>) => {
                        this.myAccount = myAccountResponse.body;
                    });
                } else {
                    this.myAccount = undefined;
                }
            });
        });
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInAccount() {
        this.eventSubscriber = this.eventManager.subscribe('accountModification', (response) => this.updateAfterAccountChanged());
    }

    updateAfterAccountChanged() {
        console.error('Account updated!!');
        this.principal.identity().then((account) => {
            console.error('Account.id: ' + account.id);
            console.error('Account.login: ' + account.login);
            console.error('Account.firstName: ' + account.firstName);
            console.error('Account.activated: ' + account.activated);
            console.error('Account.langKey: ' + account.langKey);
            console.error('Account.authorities: ' + account.authorities);
            console.error('Account.createdDate: ' + account.createdDate);
            console.error('Account.password: ' + account.password);
            console.error('Account.email: ' + account.email);
            console.error('Account.userInfo: ' + account.userInfo);
            console.error('Account.shops: ' + account.shops);
        });
    }

    changeLanguage(languageKey: string) {
        this.languageService.changeLanguage(languageKey);
    }

    collapseNavbar() {
        this.isNavbarCollapsed = true;
    }

    isAuthenticated() {
        return this.principal.isAuthenticated();
    }

    login() {
        this.modalRef = this.loginModalService.open();
    }

    logout() {
        this.collapseNavbar();
        this.loginService.logout();
        this.router.navigate(['']);
    }

    toggleNavbar() {
        this.isNavbarCollapsed = !this.isNavbarCollapsed;
    }

    getImageUrl() {
        return this.isAuthenticated() ? this.principal.getImageUrl() : null;
    }
}
