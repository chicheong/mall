import { element, by, ElementFinder } from 'protractor';

export class UrlComponentsPage {
    createButton = element(by.id('jh-create-entity'));
    deleteButtons = element.all(by.css('jhi-url div table .btn-danger'));
    title = element.all(by.css('jhi-url div h2#page-heading span')).first();

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

export class UrlUpdatePage {
    pageTitle = element(by.id('jhi-url-heading'));
    saveButton = element(by.id('save-entity'));
    cancelButton = element(by.id('cancel-save'));
    entityTypeInput = element(by.id('field_entityType'));
    entityIdInput = element(by.id('field_entityId'));
    pathInput = element(by.id('field_path'));
    fileNameInput = element(by.id('field_fileName'));
    sequenceInput = element(by.id('field_sequence'));
    descriptionInput = element(by.id('field_description'));
    createdByInput = element(by.id('field_createdBy'));
    createdDateInput = element(by.id('field_createdDate'));
    lastModifiedByInput = element(by.id('field_lastModifiedBy'));
    lastModifiedDateInput = element(by.id('field_lastModifiedDate'));

    async getPageTitle() {
        return this.pageTitle.getAttribute('jhiTranslate');
    }

    async setEntityTypeInput(entityType) {
        await this.entityTypeInput.sendKeys(entityType);
    }

    async getEntityTypeInput() {
        return this.entityTypeInput.getAttribute('value');
    }

    async setEntityIdInput(entityId) {
        await this.entityIdInput.sendKeys(entityId);
    }

    async getEntityIdInput() {
        return this.entityIdInput.getAttribute('value');
    }

    async setPathInput(path) {
        await this.pathInput.sendKeys(path);
    }

    async getPathInput() {
        return this.pathInput.getAttribute('value');
    }

    async setFileNameInput(fileName) {
        await this.fileNameInput.sendKeys(fileName);
    }

    async getFileNameInput() {
        return this.fileNameInput.getAttribute('value');
    }

    async setSequenceInput(sequence) {
        await this.sequenceInput.sendKeys(sequence);
    }

    async getSequenceInput() {
        return this.sequenceInput.getAttribute('value');
    }

    async setDescriptionInput(description) {
        await this.descriptionInput.sendKeys(description);
    }

    async getDescriptionInput() {
        return this.descriptionInput.getAttribute('value');
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

export class UrlDeleteDialog {
    private dialogTitle = element(by.id('jhi-delete-url-heading'));
    private confirmButton = element(by.id('jhi-confirm-delete-url'));

    async getDialogTitle() {
        return this.dialogTitle.getAttribute('jhiTranslate');
    }

    async clickOnConfirmButton() {
        await this.confirmButton.click();
    }
}
