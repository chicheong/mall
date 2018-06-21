import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('PaymentCreditCard e2e test', () => {

    let navBarPage: NavBarPage;
    let paymentCreditCardDialogPage: PaymentCreditCardDialogPage;
    let paymentCreditCardComponentsPage: PaymentCreditCardComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load PaymentCreditCards', () => {
        navBarPage.goToEntity('payment-credit-card');
        paymentCreditCardComponentsPage = new PaymentCreditCardComponentsPage();
        expect(paymentCreditCardComponentsPage.getTitle())
            .toMatch(/mallApp.paymentCreditCard.home.title/);

    });

    it('should load create PaymentCreditCard dialog', () => {
        paymentCreditCardComponentsPage.clickOnCreateButton();
        paymentCreditCardDialogPage = new PaymentCreditCardDialogPage();
        expect(paymentCreditCardDialogPage.getModalTitle())
            .toMatch(/mallApp.paymentCreditCard.home.createOrEditLabel/);
        paymentCreditCardDialogPage.close();
    });

    it('should create and save PaymentCreditCards', () => {
        paymentCreditCardComponentsPage.clickOnCreateButton();
        paymentCreditCardDialogPage.setNameInput('name');
        expect(paymentCreditCardDialogPage.getNameInput()).toMatch('name');
        paymentCreditCardDialogPage.setValueInput('value');
        expect(paymentCreditCardDialogPage.getValueInput()).toMatch('value');
        paymentCreditCardDialogPage.setHolderNameInput('holderName');
        expect(paymentCreditCardDialogPage.getHolderNameInput()).toMatch('holderName');
        paymentCreditCardDialogPage.setExpireDateInput(12310020012301);
        expect(paymentCreditCardDialogPage.getExpireDateInput()).toMatch('2001-12-31T02:30');
        paymentCreditCardDialogPage.paymentSelectLastOption();
        paymentCreditCardDialogPage.save();
        expect(paymentCreditCardDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class PaymentCreditCardComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-payment-credit-card div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class PaymentCreditCardDialogPage {
    modalTitle = element(by.css('h4#myPaymentCreditCardLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    nameInput = element(by.css('input#field_name'));
    valueInput = element(by.css('input#field_value'));
    holderNameInput = element(by.css('input#field_holderName'));
    expireDateInput = element(by.css('input#field_expireDate'));
    paymentSelect = element(by.css('select#field_payment'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setNameInput = function(name) {
        this.nameInput.sendKeys(name);
    };

    getNameInput = function() {
        return this.nameInput.getAttribute('value');
    };

    setValueInput = function(value) {
        this.valueInput.sendKeys(value);
    };

    getValueInput = function() {
        return this.valueInput.getAttribute('value');
    };

    setHolderNameInput = function(holderName) {
        this.holderNameInput.sendKeys(holderName);
    };

    getHolderNameInput = function() {
        return this.holderNameInput.getAttribute('value');
    };

    setExpireDateInput = function(expireDate) {
        this.expireDateInput.sendKeys(expireDate);
    };

    getExpireDateInput = function() {
        return this.expireDateInput.getAttribute('value');
    };

    paymentSelectLastOption = function() {
        this.paymentSelect.all(by.tagName('option')).last().click();
    };

    paymentSelectOption = function(option) {
        this.paymentSelect.sendKeys(option);
    };

    getPaymentSelect = function() {
        return this.paymentSelect;
    };

    getPaymentSelectedOption = function() {
        return this.paymentSelect.element(by.css('option:checked')).getText();
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
