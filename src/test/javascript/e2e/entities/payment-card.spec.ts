import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('PaymentCard e2e test', () => {

    let navBarPage: NavBarPage;
    let paymentCardDialogPage: PaymentCardDialogPage;
    let paymentCardComponentsPage: PaymentCardComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load PaymentCards', () => {
        navBarPage.goToEntity('payment-card');
        paymentCardComponentsPage = new PaymentCardComponentsPage();
        expect(paymentCardComponentsPage.getTitle())
            .toMatch(/mallApp.paymentCard.home.title/);

    });

    it('should load create PaymentCard dialog', () => {
        paymentCardComponentsPage.clickOnCreateButton();
        paymentCardDialogPage = new PaymentCardDialogPage();
        expect(paymentCardDialogPage.getModalTitle())
            .toMatch(/mallApp.paymentCard.home.createOrEditLabel/);
        paymentCardDialogPage.close();
    });

    it('should create and save PaymentCards', () => {
        paymentCardComponentsPage.clickOnCreateButton();
        paymentCardDialogPage.setHolderNameInput('holderName');
        expect(paymentCardDialogPage.getHolderNameInput()).toMatch('holderName');
        paymentCardDialogPage.setCardNumberInput('cardNumber');
        expect(paymentCardDialogPage.getCardNumberInput()).toMatch('cardNumber');
        paymentCardDialogPage.setExpirationMonthInput('expirationMonth');
        expect(paymentCardDialogPage.getExpirationMonthInput()).toMatch('expirationMonth');
        paymentCardDialogPage.setExpirationYearInput('expirationYear');
        expect(paymentCardDialogPage.getExpirationYearInput()).toMatch('expirationYear');
        paymentCardDialogPage.setCvcInput('cvc');
        expect(paymentCardDialogPage.getCvcInput()).toMatch('cvc');
        paymentCardDialogPage.save();
        expect(paymentCardDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class PaymentCardComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-payment-card div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class PaymentCardDialogPage {
    modalTitle = element(by.css('h4#myPaymentCardLabel'));
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
