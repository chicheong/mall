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
        paymentCreditCardDialogPage.setHolderNameInput('holderName');
        expect(paymentCreditCardDialogPage.getHolderNameInput()).toMatch('holderName');
        paymentCreditCardDialogPage.setCardNumberInput('cardNumber');
        expect(paymentCreditCardDialogPage.getCardNumberInput()).toMatch('cardNumber');
        paymentCreditCardDialogPage.setExpirationMonthInput('expirationMonth');
        expect(paymentCreditCardDialogPage.getExpirationMonthInput()).toMatch('expirationMonth');
        paymentCreditCardDialogPage.setExpirationYearInput('expirationYear');
        expect(paymentCreditCardDialogPage.getExpirationYearInput()).toMatch('expirationYear');
        paymentCreditCardDialogPage.setCvcInput('cvc');
        expect(paymentCreditCardDialogPage.getCvcInput()).toMatch('cvc');
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
    holderNameInput = element(by.css('input#field_holderName'));
    cardNumberInput = element(by.css('input#field_cardNumber'));
    expirationMonthInput = element(by.css('input#field_expirationMonth'));
    expirationYearInput = element(by.css('input#field_expirationYear'));
    cvcInput = element(by.css('input#field_cvc'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setHolderNameInput = function(holderName) {
        this.holderNameInput.sendKeys(holderName);
    };

    getHolderNameInput = function() {
        return this.holderNameInput.getAttribute('value');
    };

    setCardNumberInput = function(cardNumber) {
        this.cardNumberInput.sendKeys(cardNumber);
    };

    getCardNumberInput = function() {
        return this.cardNumberInput.getAttribute('value');
    };

    setExpirationMonthInput = function(expirationMonth) {
        this.expirationMonthInput.sendKeys(expirationMonth);
    };

    getExpirationMonthInput = function() {
        return this.expirationMonthInput.getAttribute('value');
    };

    setExpirationYearInput = function(expirationYear) {
        this.expirationYearInput.sendKeys(expirationYear);
    };

    getExpirationYearInput = function() {
        return this.expirationYearInput.getAttribute('value');
    };

    setCvcInput = function(cvc) {
        this.cvcInput.sendKeys(cvc);
    };

    getCvcInput = function() {
        return this.cvcInput.getAttribute('value');
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
