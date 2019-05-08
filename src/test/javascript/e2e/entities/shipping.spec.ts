import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('Shipping e2e test', () => {

    let navBarPage: NavBarPage;
    let shippingDialogPage: ShippingDialogPage;
    let shippingComponentsPage: ShippingComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load Shippings', () => {
        navBarPage.goToEntity('shipping');
        shippingComponentsPage = new ShippingComponentsPage();
        expect(shippingComponentsPage.getTitle())
            .toMatch(/mallApp.shipping.home.title/);

    });

    it('should load create Shipping dialog', () => {
        shippingComponentsPage.clickOnCreateButton();
        shippingDialogPage = new ShippingDialogPage();
        expect(shippingDialogPage.getModalTitle())
            .toMatch(/mallApp.shipping.home.createOrEditLabel/);
        shippingDialogPage.close();
    });

    it('should create and save Shippings', () => {
        shippingComponentsPage.clickOnCreateButton();
        shippingDialogPage.setPriceInput('5');
        expect(shippingDialogPage.getPriceInput()).toMatch('5');
        shippingDialogPage.currencySelectLastOption();
        shippingDialogPage.setDateInput(12310020012301);
        expect(shippingDialogPage.getDateInput()).toMatch('2001-12-31T02:30');
        shippingDialogPage.statusSelectLastOption();
        shippingDialogPage.typeSelectLastOption();
        shippingDialogPage.save();
        expect(shippingDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class ShippingComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-shipping div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class ShippingDialogPage {
    modalTitle = element(by.css('h4#myShippingLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    priceInput = element(by.css('input#field_price'));
    currencySelect = element(by.css('select#field_currency'));
    dateInput = element(by.css('input#field_date'));
    statusSelect = element(by.css('select#field_status'));
    typeSelect = element(by.css('select#field_type'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setPriceInput = function(price) {
        this.priceInput.sendKeys(price);
    };

    getPriceInput = function() {
        return this.priceInput.getAttribute('value');
    };

    setCurrencySelect = function(currency) {
        this.currencySelect.sendKeys(currency);
    };

    getCurrencySelect = function() {
        return this.currencySelect.element(by.css('option:checked')).getText();
    };

    currencySelectLastOption = function() {
        this.currencySelect.all(by.tagName('option')).last().click();
    };
    setDateInput = function(date) {
        this.dateInput.sendKeys(date);
    };

    getDateInput = function() {
        return this.dateInput.getAttribute('value');
    };

    setStatusSelect = function(status) {
        this.statusSelect.sendKeys(status);
    };

    getStatusSelect = function() {
        return this.statusSelect.element(by.css('option:checked')).getText();
    };

    statusSelectLastOption = function() {
        this.statusSelect.all(by.tagName('option')).last().click();
    };
    typeSelectLastOption = function() {
        this.typeSelect.all(by.tagName('option')).last().click();
    };

    typeSelectOption = function(option) {
        this.typeSelect.sendKeys(option);
    };

    getTypeSelect = function() {
        return this.typeSelect;
    };

    getTypeSelectedOption = function() {
        return this.typeSelect.element(by.css('option:checked')).getText();
    };

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
