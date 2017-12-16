import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('UserInfo e2e test', () => {

    let navBarPage: NavBarPage;
    let userInfoDialogPage: UserInfoDialogPage;
    let userInfoComponentsPage: UserInfoComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load UserInfos', () => {
        navBarPage.goToEntity('user-info');
        userInfoComponentsPage = new UserInfoComponentsPage();
        expect(userInfoComponentsPage.getTitle()).toMatch(/mallApp.userInfo.home.title/);

    });

    it('should load create UserInfo dialog', () => {
        userInfoComponentsPage.clickOnCreateButton();
        userInfoDialogPage = new UserInfoDialogPage();
        expect(userInfoDialogPage.getModalTitle()).toMatch(/mallApp.userInfo.home.createOrEditLabel/);
        userInfoDialogPage.close();
    });

    it('should create and save UserInfos', () => {
        userInfoComponentsPage.clickOnCreateButton();
        userInfoDialogPage.userSelectLastOption();
        // userInfoDialogPage.accountSelectLastOption();
        userInfoDialogPage.save();
        expect(userInfoDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class UserInfoComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-user-info div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class UserInfoDialogPage {
    modalTitle = element(by.css('h4#myUserInfoLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    userSelect = element(by.css('select#field_user'));
    accountSelect = element(by.css('select#field_account'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    userSelectLastOption = function() {
        this.userSelect.all(by.tagName('option')).last().click();
    }

    userSelectOption = function(option) {
        this.userSelect.sendKeys(option);
    }

    getUserSelect = function() {
        return this.userSelect;
    }

    getUserSelectedOption = function() {
        return this.userSelect.element(by.css('option:checked')).getText();
    }

    accountSelectLastOption = function() {
        this.accountSelect.all(by.tagName('option')).last().click();
    }

    accountSelectOption = function(option) {
        this.accountSelect.sendKeys(option);
    }

    getAccountSelect = function() {
        return this.accountSelect;
    }

    getAccountSelectedOption = function() {
        return this.accountSelect.element(by.css('option:checked')).getText();
    }

    save() {
        this.saveButton.click();
    }

    close() {
        this.closeButton.click();
    }

    getSaveButton() {
        return this.saveButton;
    }
}
