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
        creditCardDialogPage.setNameInput('name');
        expect(creditCardDialogPage.getNameInput()).toMatch('name');
        creditCardDialogPage.setValueInput('value');
        expect(creditCardDialogPage.getValueInput()).toMatch('value');
        creditCardDialogPage.setHolderNameInput('holderName');
        expect(creditCardDialogPage.getHolderNameInput()).toMatch('holderName');
        creditCardDialogPage.setExpireDateInput(12310020012301);
        expect(creditCardDialogPage.getExpireDateInput()).toMatch('2001-12-31T02:30');
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
    nameInput = element(by.css('input#field_name'));
    valueInput = element(by.css('input#field_value'));
    holderNameInput = element(by.css('input#field_holderName'));
    expireDateInput = element(by.css('input#field_expireDate'));
    accountSelect = element(by.css('select#field_account'));

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
