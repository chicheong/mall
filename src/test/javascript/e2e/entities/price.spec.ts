import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('Price e2e test', () => {

    let navBarPage: NavBarPage;
    let priceDialogPage: PriceDialogPage;
    let priceComponentsPage: PriceComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load Prices', () => {
        navBarPage.goToEntity('price');
        priceComponentsPage = new PriceComponentsPage();
        expect(priceComponentsPage.getTitle()).toMatch(/mallApp.price.home.title/);

    });

    it('should load create Price dialog', () => {
        priceComponentsPage.clickOnCreateButton();
        priceDialogPage = new PriceDialogPage();
        expect(priceDialogPage.getModalTitle()).toMatch(/mallApp.price.home.createOrEditLabel/);
        priceDialogPage.close();
    });

    it('should create and save Prices', () => {
        priceComponentsPage.clickOnCreateButton();
        priceDialogPage.setFromInput(12310020012301);
        expect(priceDialogPage.getFromInput()).toMatch('2001-12-31T02:30');
        priceDialogPage.setToInput(12310020012301);
        expect(priceDialogPage.getToInput()).toMatch('2001-12-31T02:30');
        priceDialogPage.setPriceInput('5');
        expect(priceDialogPage.getPriceInput()).toMatch('5');
        priceDialogPage.currencySelectLastOption();
        priceDialogPage.itemSelectLastOption();
        priceDialogPage.save();
        expect(priceDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class PriceComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-price div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class PriceDialogPage {
    modalTitle = element(by.css('h4#myPriceLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    fromInput = element(by.css('input#field_from'));
    toInput = element(by.css('input#field_to'));
    priceInput = element(by.css('input#field_price'));
    currencySelect = element(by.css('select#field_currency'));
    itemSelect = element(by.css('select#field_item'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setFromInput = function(from) {
        this.fromInput.sendKeys(from);
    }

    getFromInput = function() {
        return this.fromInput.getAttribute('value');
    }

    setToInput = function(to) {
        this.toInput.sendKeys(to);
    }

    getToInput = function() {
        return this.toInput.getAttribute('value');
    }

    setPriceInput = function(price) {
        this.priceInput.sendKeys(price);
    }

    getPriceInput = function() {
        return this.priceInput.getAttribute('value');
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
    itemSelectLastOption = function() {
        this.itemSelect.all(by.tagName('option')).last().click();
    }

    itemSelectOption = function(option) {
        this.itemSelect.sendKeys(option);
    }

    getItemSelect = function() {
        return this.itemSelect;
    }

    getItemSelectedOption = function() {
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
