import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('CreditCard e2e test', () => {

    let navBarPage: NavBarPage;
    let creditCardDialogPage: CreditCardDialogPage;
    let creditCardComponentsPage: CreditCardComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load CreditCards', () => {
        navBarPage.goToEntity('credit-card');
        creditCardComponentsPage = new CreditCardComponentsPage();
        expect(creditCardComponentsPage.getTitle())
            .toMatch(/mallApp.creditCard.home.title/);

    });

    it('should load create CreditCard dialog', () => {
        creditCardComponentsPage.clickOnCreateButton();
        creditCardDialogPage = new CreditCardDialogPage();
        expect(creditCardDialogPage.getModalTitle())
            .toMatch(/mallApp.creditCard.home.createOrEditLabel/);
        creditCardDialogPage.close();
    });

    it('should create and save CreditCards', () => {
        creditCardComponentsPage.clickOnCreateButton();
        creditCardDialogPage.setHolderNameInput('holderName');
        expect(creditCardDialogPage.getHolderNameInput()).toMatch('holderName');
        creditCardDialogPage.setCardNumberInput('cardNumber');
        expect(creditCardDialogPage.getCardNumberInput()).toMatch('cardNumber');
        creditCardDialogPage.setExpirationMonthInput('expirationMonth');
        expect(creditCardDialogPage.getExpirationMonthInput()).toMatch('expirationMonth');
        creditCardDialogPage.setExpirationYearInput('expirationYear');
        expect(creditCardDialogPage.getExpirationYearInput()).toMatch('expirationYear');
        creditCardDialogPage.setCvcInput('cvc');
        expect(creditCardDialogPage.getCvcInput()).toMatch('cvc');
        creditCardDialogPage.accountSelectLastOption();
        creditCardDialogPage.save();
        expect(creditCardDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class CreditCardComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-credit-card div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class CreditCardDialogPage {
    modalTitle = element(by.css('h4#myCreditCardLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    holderNameInput = element(by.css('input#field_holderName'));
    cardNumberInput = element(by.css('input#field_cardNumber'));
    expirationMonthInput = element(by.css('input#field_expirationMonth'));
    expirationYearInput = element(by.css('input#field_expirationYear'));
    cvcInput = element(by.css('input#field_cvc'));
    accountSelect = element(by.css('select#field_account'));

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

    accountSelectLastOption = function() {
        this.accountSelect.all(by.tagName('option')).last().click();
    };

    accountSelectOption = function(option) {
        this.accountSelect.sendKeys(option);
    };

    getAccountSelect = function() {
        return this.accountSelect;
    };

    getAccountSelectedOption = function() {
        return this.accountSelect.element(by.css('option:checked')).getText();
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
