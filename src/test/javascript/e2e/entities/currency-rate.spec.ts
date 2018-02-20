import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('CurrencyRate e2e test', () => {

    let navBarPage: NavBarPage;
    let currencyRateDialogPage: CurrencyRateDialogPage;
    let currencyRateComponentsPage: CurrencyRateComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load CurrencyRates', () => {
        navBarPage.goToEntity('currency-rate');
        currencyRateComponentsPage = new CurrencyRateComponentsPage();
        expect(currencyRateComponentsPage.getTitle())
            .toMatch(/mallApp.currencyRate.home.title/);

    });

    it('should load create CurrencyRate dialog', () => {
        currencyRateComponentsPage.clickOnCreateButton();
        currencyRateDialogPage = new CurrencyRateDialogPage();
        expect(currencyRateDialogPage.getModalTitle())
            .toMatch(/mallApp.currencyRate.home.createOrEditLabel/);
        currencyRateDialogPage.close();
    });

    it('should create and save CurrencyRates', () => {
        currencyRateComponentsPage.clickOnCreateButton();
        currencyRateDialogPage.setFromInput(12310020012301);
        expect(currencyRateDialogPage.getFromInput()).toMatch('2001-12-31T02:30');
        currencyRateDialogPage.setToInput(12310020012301);
        expect(currencyRateDialogPage.getToInput()).toMatch('2001-12-31T02:30');
        currencyRateDialogPage.setRateInput('5');
        expect(currencyRateDialogPage.getRateInput()).toMatch('5');
        currencyRateDialogPage.sourceCurrencySelectLastOption();
        currencyRateDialogPage.targetCurrencySelectLastOption();
        currencyRateDialogPage.save();
        expect(currencyRateDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class CurrencyRateComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-currency-rate div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class CurrencyRateDialogPage {
    modalTitle = element(by.css('h4#myCurrencyRateLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    fromInput = element(by.css('input#field_from'));
    toInput = element(by.css('input#field_to'));
    rateInput = element(by.css('input#field_rate'));
    sourceCurrencySelect = element(by.css('select#field_sourceCurrency'));
    targetCurrencySelect = element(by.css('select#field_targetCurrency'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setFromInput = function(from) {
        this.fromInput.sendKeys(from);
    };

    getFromInput = function() {
        return this.fromInput.getAttribute('value');
    };

    setToInput = function(to) {
        this.toInput.sendKeys(to);
    };

    getToInput = function() {
        return this.toInput.getAttribute('value');
    };

    setRateInput = function(rate) {
        this.rateInput.sendKeys(rate);
    };

    getRateInput = function() {
        return this.rateInput.getAttribute('value');
    };

    setSourceCurrencySelect = function(sourceCurrency) {
        this.sourceCurrencySelect.sendKeys(sourceCurrency);
    };

    getSourceCurrencySelect = function() {
        return this.sourceCurrencySelect.element(by.css('option:checked')).getText();
    };

    sourceCurrencySelectLastOption = function() {
        this.sourceCurrencySelect.all(by.tagName('option')).last().click();
    };
    setTargetCurrencySelect = function(targetCurrency) {
        this.targetCurrencySelect.sendKeys(targetCurrency);
    };

    getTargetCurrencySelect = function() {
        return this.targetCurrencySelect.element(by.css('option:checked')).getText();
    };

    targetCurrencySelectLastOption = function() {
        this.targetCurrencySelect.all(by.tagName('option')).last().click();
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
