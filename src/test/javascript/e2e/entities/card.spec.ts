import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('Card e2e test', () => {

    let navBarPage: NavBarPage;
    let cardDialogPage: CardDialogPage;
    let cardComponentsPage: CardComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load Cards', () => {
        navBarPage.goToEntity('card');
        cardComponentsPage = new CardComponentsPage();
        expect(cardComponentsPage.getTitle())
            .toMatch(/mallApp.card.home.title/);

    });

    it('should load create Card dialog', () => {
        cardComponentsPage.clickOnCreateButton();
        cardDialogPage = new CardDialogPage();
        expect(cardDialogPage.getModalTitle())
            .toMatch(/mallApp.card.home.createOrEditLabel/);
        cardDialogPage.close();
    });

    it('should create and save Cards', () => {
        cardComponentsPage.clickOnCreateButton();
        cardDialogPage.setHolderNameInput('holderName');
        expect(cardDialogPage.getHolderNameInput()).toMatch('holderName');
        cardDialogPage.setCardNumberInput('cardNumber');
        expect(cardDialogPage.getCardNumberInput()).toMatch('cardNumber');
        cardDialogPage.setExpirationMonthInput('expirationMonth');
        expect(cardDialogPage.getExpirationMonthInput()).toMatch('expirationMonth');
        cardDialogPage.setExpirationYearInput('expirationYear');
        expect(cardDialogPage.getExpirationYearInput()).toMatch('expirationYear');
        cardDialogPage.setCvcInput('cvc');
        expect(cardDialogPage.getCvcInput()).toMatch('cvc');
        cardDialogPage.accountSelectLastOption();
        cardDialogPage.save();
        expect(cardDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class CardComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-card div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class CardDialogPage {
    modalTitle = element(by.css('h4#myCardLabel'));
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
