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
        shippingDialogPage.setReceiverInput('receiver');
        expect(shippingDialogPage.getReceiverInput()).toMatch('receiver');
        shippingDialogPage.setContactNumInput('contactNum');
        expect(shippingDialogPage.getContactNumInput()).toMatch('contactNum');
        shippingDialogPage.setEmailInput('email');
        expect(shippingDialogPage.getEmailInput()).toMatch('email');
        shippingDialogPage.setRemarkInput('remark');
        expect(shippingDialogPage.getRemarkInput()).toMatch('remark');
        shippingDialogPage.statusSelectLastOption();
        shippingDialogPage.orderSelectLastOption();
        shippingDialogPage.shippingAddressSelectLastOption();
        shippingDialogPage.billingAddressSelectLastOption();
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
    receiverInput = element(by.css('input#field_receiver'));
    contactNumInput = element(by.css('input#field_contactNum'));
    emailInput = element(by.css('input#field_email'));
    remarkInput = element(by.css('input#field_remark'));
    statusSelect = element(by.css('select#field_status'));
    orderSelect = element(by.css('select#field_order'));
    shippingAddressSelect = element(by.css('select#field_shippingAddress'));
    billingAddressSelect = element(by.css('select#field_billingAddress'));
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

    setReceiverInput = function(receiver) {
        this.receiverInput.sendKeys(receiver);
    };

    getReceiverInput = function() {
        return this.receiverInput.getAttribute('value');
    };

    setContactNumInput = function(contactNum) {
        this.contactNumInput.sendKeys(contactNum);
    };

    getContactNumInput = function() {
        return this.contactNumInput.getAttribute('value');
    };

    setEmailInput = function(email) {
        this.emailInput.sendKeys(email);
    };

    getEmailInput = function() {
        return this.emailInput.getAttribute('value');
    };

    setRemarkInput = function(remark) {
        this.remarkInput.sendKeys(remark);
    };

    getRemarkInput = function() {
        return this.remarkInput.getAttribute('value');
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
    orderSelectLastOption = function() {
        this.orderSelect.all(by.tagName('option')).last().click();
    };

    orderSelectOption = function(option) {
        this.orderSelect.sendKeys(option);
    };

    getOrderSelect = function() {
        return this.orderSelect;
    };

    getOrderSelectedOption = function() {
        return this.orderSelect.element(by.css('option:checked')).getText();
    };

    shippingAddressSelectLastOption = function() {
        this.shippingAddressSelect.all(by.tagName('option')).last().click();
    };

    shippingAddressSelectOption = function(option) {
        this.shippingAddressSelect.sendKeys(option);
    };

    getShippingAddressSelect = function() {
        return this.shippingAddressSelect;
    };

    getShippingAddressSelectedOption = function() {
        return this.shippingAddressSelect.element(by.css('option:checked')).getText();
    };

    billingAddressSelectLastOption = function() {
        this.billingAddressSelect.all(by.tagName('option')).last().click();
    };

    billingAddressSelectOption = function(option) {
        this.billingAddressSelect.sendKeys(option);
    };

    getBillingAddressSelect = function() {
        return this.billingAddressSelect;
    };

    getBillingAddressSelectedOption = function() {
        return this.billingAddressSelect.element(by.css('option:checked')).getText();
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
