import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('Payment e2e test', () => {

    let navBarPage: NavBarPage;
    let paymentDialogPage: PaymentDialogPage;
    let paymentComponentsPage: PaymentComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load Payments', () => {
        navBarPage.goToEntity('payment');
        paymentComponentsPage = new PaymentComponentsPage();
        expect(paymentComponentsPage.getTitle())
            .toMatch(/mallApp.payment.home.title/);

    });

    it('should load create Payment dialog', () => {
        paymentComponentsPage.clickOnCreateButton();
        paymentDialogPage = new PaymentDialogPage();
        expect(paymentDialogPage.getModalTitle())
            .toMatch(/mallApp.payment.home.createOrEditLabel/);
        paymentDialogPage.close();
    });

    it('should create and save Payments', () => {
        paymentComponentsPage.clickOnCreateButton();
        paymentDialogPage.setAmountInput('5');
        expect(paymentDialogPage.getAmountInput()).toMatch('5');
        paymentDialogPage.currencySelectLastOption();
        paymentDialogPage.typeSelectLastOption();
        paymentDialogPage.setRemarkInput('remark');
        expect(paymentDialogPage.getRemarkInput()).toMatch('remark');
        paymentDialogPage.statusSelectLastOption();
        paymentDialogPage.orderSelectLastOption();
        paymentDialogPage.save();
        expect(paymentDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class PaymentComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-payment div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class PaymentDialogPage {
    modalTitle = element(by.css('h4#myPaymentLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    amountInput = element(by.css('input#field_amount'));
    currencySelect = element(by.css('select#field_currency'));
    typeSelect = element(by.css('select#field_type'));
    remarkInput = element(by.css('input#field_remark'));
    statusSelect = element(by.css('select#field_status'));
    orderSelect = element(by.css('select#field_order'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setAmountInput = function(amount) {
        this.amountInput.sendKeys(amount);
    };

    getAmountInput = function() {
        return this.amountInput.getAttribute('value');
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
    setTypeSelect = function(type) {
        this.typeSelect.sendKeys(type);
    };

    getTypeSelect = function() {
        return this.typeSelect.element(by.css('option:checked')).getText();
    };

    typeSelectLastOption = function() {
        this.typeSelect.all(by.tagName('option')).last().click();
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
