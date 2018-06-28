import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('PaymentStatusHistory e2e test', () => {

    let navBarPage: NavBarPage;
    let paymentStatusHistoryDialogPage: PaymentStatusHistoryDialogPage;
    let paymentStatusHistoryComponentsPage: PaymentStatusHistoryComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load PaymentStatusHistories', () => {
        navBarPage.goToEntity('payment-status-history');
        paymentStatusHistoryComponentsPage = new PaymentStatusHistoryComponentsPage();
        expect(paymentStatusHistoryComponentsPage.getTitle())
            .toMatch(/mallApp.paymentStatusHistory.home.title/);

    });

    it('should load create PaymentStatusHistory dialog', () => {
        paymentStatusHistoryComponentsPage.clickOnCreateButton();
        paymentStatusHistoryDialogPage = new PaymentStatusHistoryDialogPage();
        expect(paymentStatusHistoryDialogPage.getModalTitle())
            .toMatch(/mallApp.paymentStatusHistory.home.createOrEditLabel/);
        paymentStatusHistoryDialogPage.close();
    });

    it('should create and save PaymentStatusHistories', () => {
        paymentStatusHistoryComponentsPage.clickOnCreateButton();
        paymentStatusHistoryDialogPage.setEffectiveDateInput(12310020012301);
        expect(paymentStatusHistoryDialogPage.getEffectiveDateInput()).toMatch('2001-12-31T02:30');
        paymentStatusHistoryDialogPage.statusSelectLastOption();
        paymentStatusHistoryDialogPage.paymentSelectLastOption();
        paymentStatusHistoryDialogPage.save();
        expect(paymentStatusHistoryDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class PaymentStatusHistoryComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-payment-status-history div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class PaymentStatusHistoryDialogPage {
    modalTitle = element(by.css('h4#myPaymentStatusHistoryLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    effectiveDateInput = element(by.css('input#field_effectiveDate'));
    statusSelect = element(by.css('select#field_status'));
    paymentSelect = element(by.css('select#field_payment'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setEffectiveDateInput = function(effectiveDate) {
        this.effectiveDateInput.sendKeys(effectiveDate);
    };

    getEffectiveDateInput = function() {
        return this.effectiveDateInput.getAttribute('value');
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
