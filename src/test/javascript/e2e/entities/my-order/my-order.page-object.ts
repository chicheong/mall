import { element, by, ElementFinder } from 'protractor';

export class MyOrderComponentsPage {
    createButton = element(by.id('jh-create-entity'));
    deleteButtons = element.all(by.css('jhi-my-order div table .btn-danger'));
    title = element.all(by.css('jhi-my-order div h2#page-heading span')).first();

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

export class MyOrderUpdatePage {
    pageTitle = element(by.id('jhi-my-order-heading'));
    saveButton = element(by.id('save-entity'));
    cancelButton = element(by.id('cancel-save'));
    receiverInput = element(by.id('field_receiver'));
    totalInput = element(by.id('field_total'));
    currencySelect = element(by.id('field_currency'));
    contactNumInput = element(by.id('field_contactNum'));
    emailInput = element(by.id('field_email'));
    remarkInput = element(by.id('field_remark'));
    statusSelect = element(by.id('field_status'));
    shippingAddressSelect = element(by.id('field_shippingAddress'));
    billingAddressSelect = element(by.id('field_billingAddress'));
    accountSelect = element(by.id('field_account'));

    async getPageTitle() {
        return this.pageTitle.getAttribute('jhiTranslate');
    }

    async setReceiverInput(receiver) {
        await this.receiverInput.sendKeys(receiver);
    }

    async getReceiverInput() {
        return this.receiverInput.getAttribute('value');
    }

    async setTotalInput(total) {
        await this.totalInput.sendKeys(total);
    }

    async getTotalInput() {
        return this.totalInput.getAttribute('value');
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

    async setContactNumInput(contactNum) {
        await this.contactNumInput.sendKeys(contactNum);
    }

    async getContactNumInput() {
        return this.contactNumInput.getAttribute('value');
    }

    async setEmailInput(email) {
        await this.emailInput.sendKeys(email);
    }

    async getEmailInput() {
        return this.emailInput.getAttribute('value');
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

    async shippingAddressSelectLastOption() {
        await this.shippingAddressSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    async shippingAddressSelectOption(option) {
        await this.shippingAddressSelect.sendKeys(option);
    }

    getShippingAddressSelect(): ElementFinder {
        return this.shippingAddressSelect;
    }

    async getShippingAddressSelectedOption() {
        return this.shippingAddressSelect.element(by.css('option:checked')).getText();
    }

    async billingAddressSelectLastOption() {
        await this.billingAddressSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    async billingAddressSelectOption(option) {
        await this.billingAddressSelect.sendKeys(option);
    }

    getBillingAddressSelect(): ElementFinder {
        return this.billingAddressSelect;
    }

    async getBillingAddressSelectedOption() {
        return this.billingAddressSelect.element(by.css('option:checked')).getText();
    }

    async accountSelectLastOption() {
        await this.accountSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    async accountSelectOption(option) {
        await this.accountSelect.sendKeys(option);
    }

    getAccountSelect(): ElementFinder {
        return this.accountSelect;
    }

    async getAccountSelectedOption() {
        return this.accountSelect.element(by.css('option:checked')).getText();
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

export class MyOrderDeleteDialog {
    private dialogTitle = element(by.id('jhi-delete-myOrder-heading'));
    private confirmButton = element(by.id('jhi-confirm-delete-myOrder'));

    async getDialogTitle() {
        return this.dialogTitle.getAttribute('jhiTranslate');
    }

    async clickOnConfirmButton() {
        await this.confirmButton.click();
    }
}
