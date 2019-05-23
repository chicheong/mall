import { element, by, ElementFinder } from 'protractor';

export class ProductHistoryComponentsPage {
    createButton = element(by.id('jh-create-entity'));
    deleteButtons = element.all(by.css('jhi-product-history div table .btn-danger'));
    title = element.all(by.css('jhi-product-history div h2#page-heading span')).first();

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

export class ProductHistoryUpdatePage {
    pageTitle = element(by.id('jhi-product-history-heading'));
    saveButton = element(by.id('save-entity'));
    cancelButton = element(by.id('cancel-save'));
    productIdInput = element(by.id('field_productId'));
    nameInput = element(by.id('field_name'));
    codeInput = element(by.id('field_code'));
    brandInput = element(by.id('field_brand'));
    descriptionInput = element(by.id('field_description'));
    contentInput = element(by.id('field_content'));
    remarkInput = element(by.id('field_remark'));
    statusSelect = element(by.id('field_status'));
    createdByInput = element(by.id('field_createdBy'));
    createdDateInput = element(by.id('field_createdDate'));

    async getPageTitle() {
        return this.pageTitle.getAttribute('jhiTranslate');
    }

    async setProductIdInput(productId) {
        await this.productIdInput.sendKeys(productId);
    }

    async getProductIdInput() {
        return this.productIdInput.getAttribute('value');
    }

    async setNameInput(name) {
        await this.nameInput.sendKeys(name);
    }

    async getNameInput() {
        return this.nameInput.getAttribute('value');
    }

    async setCodeInput(code) {
        await this.codeInput.sendKeys(code);
    }

    async getCodeInput() {
        return this.codeInput.getAttribute('value');
    }

    async setBrandInput(brand) {
        await this.brandInput.sendKeys(brand);
    }

    async getBrandInput() {
        return this.brandInput.getAttribute('value');
    }

    async setDescriptionInput(description) {
        await this.descriptionInput.sendKeys(description);
    }

    async getDescriptionInput() {
        return this.descriptionInput.getAttribute('value');
    }

    async setContentInput(content) {
        await this.contentInput.sendKeys(content);
    }

    async getContentInput() {
        return this.contentInput.getAttribute('value');
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

export class ProductHistoryDeleteDialog {
    private dialogTitle = element(by.id('jhi-delete-productHistory-heading'));
    private confirmButton = element(by.id('jhi-confirm-delete-productHistory'));

    async getDialogTitle() {
        return this.dialogTitle.getAttribute('jhiTranslate');
    }

    async clickOnConfirmButton() {
        await this.confirmButton.click();
    }
}
