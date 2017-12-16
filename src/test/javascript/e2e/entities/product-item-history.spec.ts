import { browser, element, by, $ } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';
const path = require('path');

describe('ProductItemHistory e2e test', () => {

    let navBarPage: NavBarPage;
    let productItemHistoryDialogPage: ProductItemHistoryDialogPage;
    let productItemHistoryComponentsPage: ProductItemHistoryComponentsPage;
    const fileToUpload = '../../../../main/webapp/content/images/logo-jhipster.png';
    const absolutePath = path.resolve(__dirname, fileToUpload);
    

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load ProductItemHistories', () => {
        navBarPage.goToEntity('product-item-history');
        productItemHistoryComponentsPage = new ProductItemHistoryComponentsPage();
        expect(productItemHistoryComponentsPage.getTitle()).toMatch(/mallApp.productItemHistory.home.title/);

    });

    it('should load create ProductItemHistory dialog', () => {
        productItemHistoryComponentsPage.clickOnCreateButton();
        productItemHistoryDialogPage = new ProductItemHistoryDialogPage();
        expect(productItemHistoryDialogPage.getModalTitle()).toMatch(/mallApp.productItemHistory.home.createOrEditLabel/);
        productItemHistoryDialogPage.close();
    });

    it('should create and save ProductItemHistories', () => {
        productItemHistoryComponentsPage.clickOnCreateButton();
        productItemHistoryDialogPage.setNameInput('name');
        expect(productItemHistoryDialogPage.getNameInput()).toMatch('name');
        productItemHistoryDialogPage.setCodeInput('code');
        expect(productItemHistoryDialogPage.getCodeInput()).toMatch('code');
        productItemHistoryDialogPage.getDefaultItemInput().isSelected().then(function (selected) {
            if (selected) {
                productItemHistoryDialogPage.getDefaultItemInput().click();
                expect(productItemHistoryDialogPage.getDefaultItemInput().isSelected()).toBeFalsy();
            } else {
                productItemHistoryDialogPage.getDefaultItemInput().click();
                expect(productItemHistoryDialogPage.getDefaultItemInput().isSelected()).toBeTruthy();
            }
        });
        productItemHistoryDialogPage.setColorInput('color');
        expect(productItemHistoryDialogPage.getColorInput()).toMatch('color');
        productItemHistoryDialogPage.setSizeInput('size');
        expect(productItemHistoryDialogPage.getSizeInput()).toMatch('size');
        productItemHistoryDialogPage.setQuantityInput('5');
        expect(productItemHistoryDialogPage.getQuantityInput()).toMatch('5');
        productItemHistoryDialogPage.currencySelectLastOption();
        productItemHistoryDialogPage.setPriceInput('5');
        expect(productItemHistoryDialogPage.getPriceInput()).toMatch('5');
        productItemHistoryDialogPage.setCreatedByInput('createdBy');
        expect(productItemHistoryDialogPage.getCreatedByInput()).toMatch('createdBy');
        productItemHistoryDialogPage.setCreatedDateInput(12310020012301);
        expect(productItemHistoryDialogPage.getCreatedDateInput()).toMatch('2001-12-31T02:30');
        productItemHistoryDialogPage.setLastModifiedByInput('lastModifiedBy');
        expect(productItemHistoryDialogPage.getLastModifiedByInput()).toMatch('lastModifiedBy');
        productItemHistoryDialogPage.setLastModifiedDateInput(12310020012301);
        expect(productItemHistoryDialogPage.getLastModifiedDateInput()).toMatch('2001-12-31T02:30');
        productItemHistoryDialogPage.itemSelectLastOption();
        productItemHistoryDialogPage.save();
        expect(productItemHistoryDialogPage.getSaveButton().isPresent()).toBeFalsy();
    }); 

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class ProductItemHistoryComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-product-item-history div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class ProductItemHistoryDialogPage {
    modalTitle = element(by.css('h4#myProductItemHistoryLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    nameInput = element(by.css('input#field_name'));
    codeInput = element(by.css('input#field_code'));
    defaultItemInput = element(by.css('input#field_defaultItem'));
    colorInput = element(by.css('input#field_color'));
    sizeInput = element(by.css('input#field_size'));
    quantityInput = element(by.css('input#field_quantity'));
    currencySelect = element(by.css('select#field_currency'));
    priceInput = element(by.css('input#field_price'));
    createdByInput = element(by.css('input#field_createdBy'));
    createdDateInput = element(by.css('input#field_createdDate'));
    lastModifiedByInput = element(by.css('input#field_lastModifiedBy'));
    lastModifiedDateInput = element(by.css('input#field_lastModifiedDate'));
    itemSelect = element(by.css('select#field_item'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setNameInput = function (name) {
        this.nameInput.sendKeys(name);
    }

    getNameInput = function () {
        return this.nameInput.getAttribute('value');
    }

    setCodeInput = function (code) {
        this.codeInput.sendKeys(code);
    }

    getCodeInput = function () {
        return this.codeInput.getAttribute('value');
    }

    getDefaultItemInput = function () {
        return this.defaultItemInput;
    }
    setColorInput = function (color) {
        this.colorInput.sendKeys(color);
    }

    getColorInput = function () {
        return this.colorInput.getAttribute('value');
    }

    setSizeInput = function (size) {
        this.sizeInput.sendKeys(size);
    }

    getSizeInput = function () {
        return this.sizeInput.getAttribute('value');
    }

    setQuantityInput = function (quantity) {
        this.quantityInput.sendKeys(quantity);
    }

    getQuantityInput = function () {
        return this.quantityInput.getAttribute('value');
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
    setPriceInput = function (price) {
        this.priceInput.sendKeys(price);
    }

    getPriceInput = function () {
        return this.priceInput.getAttribute('value');
    }

    setCreatedByInput = function (createdBy) {
        this.createdByInput.sendKeys(createdBy);
    }

    getCreatedByInput = function () {
        return this.createdByInput.getAttribute('value');
    }

    setCreatedDateInput = function (createdDate) {
        this.createdDateInput.sendKeys(createdDate);
    }

    getCreatedDateInput = function () {
        return this.createdDateInput.getAttribute('value');
    }

    setLastModifiedByInput = function (lastModifiedBy) {
        this.lastModifiedByInput.sendKeys(lastModifiedBy);
    }

    getLastModifiedByInput = function () {
        return this.lastModifiedByInput.getAttribute('value');
    }

    setLastModifiedDateInput = function (lastModifiedDate) {
        this.lastModifiedDateInput.sendKeys(lastModifiedDate);
    }

    getLastModifiedDateInput = function () {
        return this.lastModifiedDateInput.getAttribute('value');
    }

    itemSelectLastOption = function () {
        this.itemSelect.all(by.tagName('option')).last().click();
    }

    itemSelectOption = function (option) {
        this.itemSelect.sendKeys(option);
    }

    getItemSelect = function () {
        return this.itemSelect;
    }

    getItemSelectedOption = function () {
        return this.itemSelect.element(by.css('option:checked')).getText();
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
