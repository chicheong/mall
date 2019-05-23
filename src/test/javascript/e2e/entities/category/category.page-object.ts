import { element, by, ElementFinder } from 'protractor';

export class CategoryComponentsPage {
    createButton = element(by.id('jh-create-entity'));
    deleteButtons = element.all(by.css('jhi-category div table .btn-danger'));
    title = element.all(by.css('jhi-category div h2#page-heading span')).first();

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

export class CategoryUpdatePage {
    pageTitle = element(by.id('jhi-category-heading'));
    saveButton = element(by.id('save-entity'));
    cancelButton = element(by.id('cancel-save'));
    nameInput = element(by.id('field_name'));
    descriptionInput = element(by.id('field_description'));
    statusSelect = element(by.id('field_status'));
    createdByInput = element(by.id('field_createdBy'));
    createdDateInput = element(by.id('field_createdDate'));
    lastModifiedByInput = element(by.id('field_lastModifiedBy'));
    lastModifiedDateInput = element(by.id('field_lastModifiedDate'));
    parentSelect = element(by.id('field_parent'));
    productSelect = element(by.id('field_product'));

    async getPageTitle() {
        return this.pageTitle.getAttribute('jhiTranslate');
    }

    async setNameInput(name) {
        await this.nameInput.sendKeys(name);
    }

    async getNameInput() {
        return this.nameInput.getAttribute('value');
    }

    async setDescriptionInput(description) {
        await this.descriptionInput.sendKeys(description);
    }

    async getDescriptionInput() {
        return this.descriptionInput.getAttribute('value');
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

    async parentSelectLastOption() {
        await this.parentSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    async parentSelectOption(option) {
        await this.parentSelect.sendKeys(option);
    }

    getParentSelect(): ElementFinder {
        return this.parentSelect;
    }

    async getParentSelectedOption() {
        return this.parentSelect.element(by.css('option:checked')).getText();
    }

    async productSelectLastOption() {
        await this.productSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    async productSelectOption(option) {
        await this.productSelect.sendKeys(option);
    }

    getProductSelect(): ElementFinder {
        return this.productSelect;
    }

    async getProductSelectedOption() {
        return this.productSelect.element(by.css('option:checked')).getText();
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

export class CategoryDeleteDialog {
    private dialogTitle = element(by.id('jhi-delete-category-heading'));
    private confirmButton = element(by.id('jhi-confirm-delete-category'));

    async getDialogTitle() {
        return this.dialogTitle.getAttribute('jhiTranslate');
    }

    async clickOnConfirmButton() {
        await this.confirmButton.click();
    }
}
