import { element, by, ElementFinder } from 'protractor';

export class DelegationComponentsPage {
    createButton = element(by.id('jh-create-entity'));
    deleteButtons = element.all(by.css('jhi-delegation div table .btn-danger'));
    title = element.all(by.css('jhi-delegation div h2#page-heading span')).first();

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

export class DelegationUpdatePage {
    pageTitle = element(by.id('jhi-delegation-heading'));
    saveButton = element(by.id('save-entity'));
    cancelButton = element(by.id('cancel-save'));
    fromInput = element(by.id('field_from'));
    toInput = element(by.id('field_to'));
    typeSelect = element(by.id('field_type'));
    delegateIdInput = element(by.id('field_delegateId'));
    statusSelect = element(by.id('field_status'));
    createdByInput = element(by.id('field_createdBy'));
    createdDateInput = element(by.id('field_createdDate'));
    lastModifiedByInput = element(by.id('field_lastModifiedBy'));
    lastModifiedDateInput = element(by.id('field_lastModifiedDate'));
    accountSelect = element(by.id('field_account'));

    async getPageTitle() {
        return this.pageTitle.getAttribute('jhiTranslate');
    }

    async setFromInput(from) {
        await this.fromInput.sendKeys(from);
    }

    async getFromInput() {
        return this.fromInput.getAttribute('value');
    }

    async setToInput(to) {
        await this.toInput.sendKeys(to);
    }

    async getToInput() {
        return this.toInput.getAttribute('value');
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

    async setDelegateIdInput(delegateId) {
        await this.delegateIdInput.sendKeys(delegateId);
    }

    async getDelegateIdInput() {
        return this.delegateIdInput.getAttribute('value');
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

    async setCreatedByInput(createdBy) {
        await this.createdByInput.sendKeys(createdBy);
    }

    async getCreatedByInput() {
        return this.createdByInput.getAttribute('value');
    }

    async setCreatedDateInput(createdDate) {
        await this.createdDateInput.sendKeys(createdDate);
    }

    async getCreatedDateInput() {
        return this.createdDateInput.getAttribute('value');
    }

    async setLastModifiedByInput(lastModifiedBy) {
        await this.lastModifiedByInput.sendKeys(lastModifiedBy);
    }

    async getLastModifiedByInput() {
        return this.lastModifiedByInput.getAttribute('value');
    }

    async setLastModifiedDateInput(lastModifiedDate) {
        await this.lastModifiedDateInput.sendKeys(lastModifiedDate);
    }

    async getLastModifiedDateInput() {
        return this.lastModifiedDateInput.getAttribute('value');
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

export class DelegationDeleteDialog {
    private dialogTitle = element(by.id('jhi-delete-delegation-heading'));
    private confirmButton = element(by.id('jhi-confirm-delete-delegation'));

    async getDialogTitle() {
        return this.dialogTitle.getAttribute('jhiTranslate');
    }

    async clickOnConfirmButton() {
        await this.confirmButton.click();
    }
}
