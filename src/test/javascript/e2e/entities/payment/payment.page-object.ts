import { element, by, ElementFinder } from 'protractor';

export class PaymentComponentsPage {
    createButton = element(by.id('jh-create-entity'));
    deleteButtons = element.all(by.css('jhi-payment div table .btn-danger'));
    title = element.all(by.css('jhi-payment div h2#page-heading span')).first();

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

export class PaymentUpdatePage {
    pageTitle = element(by.id('jhi-payment-heading'));
    saveButton = element(by.id('save-entity'));
    cancelButton = element(by.id('cancel-save'));
    amountInput = element(by.id('field_amount'));
    currencySelect = element(by.id('field_currency'));
    typeSelect = element(by.id('field_type'));
    remarkInput = element(by.id('field_remark'));
    statusSelect = element(by.id('field_status'));

    async getPageTitle() {
        return this.pageTitle.getAttribute('jhiTranslate');
    }

    async setAmountInput(amount) {
        await this.amountInput.sendKeys(amount);
    }

    async getAmountInput() {
        return this.amountInput.getAttribute('value');
    }

    async setCurrencySelect(currency) {
        await this.currencySelect.sendKeys(currency);
    }

    async getCurrencySelect() {
        return this.currencySelect.element(by.css('option:checked')).getText();
    }

    async currencySelectLastOption() {
        await this.currencySelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    async setTypeSelect(type) {
        await this.typeSelect.sendKeys(type);
    }

    async getTypeSelect() {
        return this.typeSelect.element(by.css('option:checked')).getText();
    }

    async typeSelectLastOption() {
        await this.typeSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    async setRemarkInput(remark) {
        await this.remarkInput.sendKeys(remark);
    }

    async getRemarkInput() {
        return this.remarkInput.getAttribute('value');
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

export class PaymentDeleteDialog {
    private dialogTitle = element(by.id('jhi-delete-payment-heading'));
    private confirmButton = element(by.id('jhi-confirm-delete-payment'));

    async getDialogTitle() {
        return this.dialogTitle.getAttribute('jhiTranslate');
    }

    async clickOnConfirmButton() {
        await this.confirmButton.click();
    }
}
