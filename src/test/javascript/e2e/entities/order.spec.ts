import { browser, element, by, $ } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';
const path = require('path');

describe('Order e2e test', () => {

    let navBarPage: NavBarPage;
    let orderDialogPage: OrderDialogPage;
    let orderComponentsPage: OrderComponentsPage;
    const fileToUpload = '../../../../main/webapp/content/images/logo-jhipster.png';
    const absolutePath = path.resolve(__dirname, fileToUpload);
    

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load Orders', () => {
        navBarPage.goToEntity('order');
        orderComponentsPage = new OrderComponentsPage();
        expect(orderComponentsPage.getTitle()).toMatch(/mallApp.order.home.title/);

    });

    it('should load create Order dialog', () => {
        orderComponentsPage.clickOnCreateButton();
        orderDialogPage = new OrderDialogPage();
        expect(orderDialogPage.getModalTitle()).toMatch(/mallApp.order.home.createOrEditLabel/);
        orderDialogPage.close();
    });

    it('should create and save Orders', () => {
        orderComponentsPage.clickOnCreateButton();
        orderDialogPage.setTotalInput('5');
        expect(orderDialogPage.getTotalInput()).toMatch('5');
        orderDialogPage.currencySelectLastOption();
        orderDialogPage.setRemarkInput('remark');
        expect(orderDialogPage.getRemarkInput()).toMatch('remark');
        orderDialogPage.statusSelectLastOption();
        orderDialogPage.userInfoSelectLastOption();
        orderDialogPage.save();
        expect(orderDialogPage.getSaveButton().isPresent()).toBeFalsy();
    }); 

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class OrderComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-order div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class OrderDialogPage {
    modalTitle = element(by.css('h4#myOrderLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    totalInput = element(by.css('input#field_total'));
    currencySelect = element(by.css('select#field_currency'));
    remarkInput = element(by.css('input#field_remark'));
    statusSelect = element(by.css('select#field_status'));
    userInfoSelect = element(by.css('select#field_userInfo'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setTotalInput = function (total) {
        this.totalInput.sendKeys(total);
    }

    getTotalInput = function () {
        return this.totalInput.getAttribute('value');
    }

    setCurrencySelect = function (currency) {
        this.currencySelect.sendKeys(currency);
    }

    getCurrencySelect = function () {
        return this.currencySelect.element(by.css('option:checked')).getText();
    }

    currencySelectLastOption = function () {
        this.currencySelect.all(by.tagName('option')).last().click();
    }
    setRemarkInput = function (remark) {
        this.remarkInput.sendKeys(remark);
    }

    getRemarkInput = function () {
        return this.remarkInput.getAttribute('value');
    }

    setStatusSelect = function (status) {
        this.statusSelect.sendKeys(status);
    }

    getStatusSelect = function () {
        return this.statusSelect.element(by.css('option:checked')).getText();
    }

    statusSelectLastOption = function () {
        this.statusSelect.all(by.tagName('option')).last().click();
    }
    userInfoSelectLastOption = function () {
        this.userInfoSelect.all(by.tagName('option')).last().click();
    }

    userInfoSelectOption = function (option) {
        this.userInfoSelect.sendKeys(option);
    }

    getUserInfoSelect = function () {
        return this.userInfoSelect;
    }

    getUserInfoSelectedOption = function () {
        return this.userInfoSelect.element(by.css('option:checked')).getText();
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
