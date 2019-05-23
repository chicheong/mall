import { element, by, ElementFinder } from 'protractor';

export class PaymentStatusHistoryComponentsPage {
    createButton = element(by.id('jh-create-entity'));
    deleteButtons = element.all(by.css('jhi-payment-status-history div table .btn-danger'));
    title = element.all(by.css('jhi-payment-status-history div h2#page-heading span')).first();

    async clickOnCreateButton() {
        await this.createButton.click();
    }

    async clickOnLastDeleteButton() {
        await this.deleteButtons.last().click();
    }

    async countDeleteButtons() {
        return this.deleteButtons.count();
    }

    async getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class PaymentStatusHistoryUpdatePage {
    pageTitle = element(by.id('jhi-payment-status-history-heading'));
    saveButton = element(by.id('save-entity'));
    cancelButton = element(by.id('cancel-save'));
    effectiveDateInput = element(by.id('field_effectiveDate'));
    statusSelect = element(by.id('field_status'));
    paymentSelect = element(by.id('field_payment'));

    async getPageTitle() {
        return this.pageTitle.getAttribute('jhiTranslate');
    }

    async setEffectiveDateInput(effectiveDate) {
        await this.effectiveDateInput.sendKeys(effectiveDate);
    }

    async getEffectiveDateInput() {
        return this.effectiveDateInput.getAttribute('value');
    }

    async setStatusSelect(status) {
        await this.statusSelect.sendKeys(status);
    }

    async getStatusSelect() {
        return this.statusSelect.element(by.css('option:checked')).getText();
    }

    async statusSelectLastOption() {
        await this.statusSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    async paymentSelectLastOption() {
        await this.paymentSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    async paymentSelectOption(option) {
        await this.paymentSelect.sendKeys(option);
    }

    getPaymentSelect(): ElementFinder {
        return this.paymentSelect;
    }

    async getPaymentSelectedOption() {
        return this.paymentSelect.element(by.css('option:checked')).getText();
    }

    async save() {
        await this.saveButton.click();
    }

    async cancel() {
        await this.cancelButton.click();
    }

    getSaveButton(): ElementFinder {
        return this.saveButton;
    }
}

export class PaymentStatusHistoryDeleteDialog {
    private dialogTitle = element(by.id('jhi-delete-paymentStatusHistory-heading'));
    private confirmButton = element(by.id('jhi-confirm-delete-paymentStatusHistory'));

    async getDialogTitle() {
        return this.dialogTitle.getAttribute('jhiTranslate');
    }

    async clickOnConfirmButton() {
        await this.confirmButton.click();
    }
}
