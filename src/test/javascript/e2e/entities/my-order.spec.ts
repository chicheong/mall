import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('MyOrder e2e test', () => {

    let navBarPage: NavBarPage;
    let myOrderDialogPage: MyOrderDialogPage;
    let myOrderComponentsPage: MyOrderComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load MyOrders', () => {
        navBarPage.goToEntity('my-order');
        myOrderComponentsPage = new MyOrderComponentsPage();
        expect(myOrderComponentsPage.getTitle()).toMatch(/mallApp.myOrder.home.title/);

    });

    it('should load create MyOrder dialog', () => {
        myOrderComponentsPage.clickOnCreateButton();
        myOrderDialogPage = new MyOrderDialogPage();
        expect(myOrderDialogPage.getModalTitle()).toMatch(/mallApp.myOrder.home.createOrEditLabel/);
        myOrderDialogPage.close();
    });

    it('should create and save MyOrders', () => {
        myOrderComponentsPage.clickOnCreateButton();
        myOrderDialogPage.setTotalInput('5');
        expect(myOrderDialogPage.getTotalInput()).toMatch('5');
        myOrderDialogPage.currencySelectLastOption();
        myOrderDialogPage.setRemarkInput('remark');
        expect(myOrderDialogPage.getRemarkInput()).toMatch('remark');
        myOrderDialogPage.statusSelectLastOption();
        myOrderDialogPage.accountSelectLastOption();
        myOrderDialogPage.save();
        expect(myOrderDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class MyOrderComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-my-order div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class MyOrderDialogPage {
    modalTitle = element(by.css('h4#myMyOrderLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    totalInput = element(by.css('input#field_total'));
    currencySelect = element(by.css('select#field_currency'));
    remarkInput = element(by.css('input#field_remark'));
    statusSelect = element(by.css('select#field_status'));
    accountSelect = element(by.css('select#field_account'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setTotalInput = function(total) {
        this.totalInput.sendKeys(total);
    }

    getTotalInput = function() {
        return this.totalInput.getAttribute('value');
    }

    setCurrencySelect = function(currency) {
        this.currencySelect.sendKeys(currency);
    }

    getCurrencySelect = function() {
        return this.currencySelect.element(by.css('option:checked')).getText();
    }

    currencySelectLastOption = function() {
        this.currencySelect.all(by.tagName('option')).last().click();
    }
    setRemarkInput = function(remark) {
        this.remarkInput.sendKeys(remark);
    }

    getRemarkInput = function() {
        return this.remarkInput.getAttribute('value');
    }

    setStatusSelect = function(status) {
        this.statusSelect.sendKeys(status);
    }

    getStatusSelect = function() {
        return this.statusSelect.element(by.css('option:checked')).getText();
    }

    statusSelectLastOption = function() {
        this.statusSelect.all(by.tagName('option')).last().click();
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
