import { element, by, ElementFinder } from 'protractor';

export class UrlComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-url div table .btn-danger'));
  title = element.all(by.css('jhi-url div h2#page-heading span')).first();
  noResult = element(by.id('no-result'));
  entities = element(by.id('entities'));

  async clickOnCreateButton(): Promise<void> {
    await this.createButton.click();
  }

  async clickOnLastDeleteButton(): Promise<void> {
    await this.deleteButtons.last().click();
  }

  async countDeleteButtons(): Promise<number> {
    return this.deleteButtons.count();
  }

  async getTitle(): Promise<string> {
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

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setEntityTypeInput(entityType: string): Promise<void> {
    await this.entityTypeInput.sendKeys(entityType);
  }

  async getEntityTypeInput(): Promise<string> {
    return await this.entityTypeInput.getAttribute('value');
  }

  async setEntityIdInput(entityId: string): Promise<void> {
    await this.entityIdInput.sendKeys(entityId);
  }

  async getEntityIdInput(): Promise<string> {
    return await this.entityIdInput.getAttribute('value');
  }

  async setPathInput(path: string): Promise<void> {
    await this.pathInput.sendKeys(path);
  }

  async getPathInput(): Promise<string> {
    return await this.pathInput.getAttribute('value');
  }

  async setFileNameInput(fileName: string): Promise<void> {
    await this.fileNameInput.sendKeys(fileName);
  }

  async getFileNameInput(): Promise<string> {
    return await this.fileNameInput.getAttribute('value');
  }

  async setSequenceInput(sequence: string): Promise<void> {
    await this.sequenceInput.sendKeys(sequence);
  }

  async getSequenceInput(): Promise<string> {
    return await this.sequenceInput.getAttribute('value');
  }

  async setDescriptionInput(description: string): Promise<void> {
    await this.descriptionInput.sendKeys(description);
  }

  async getDescriptionInput(): Promise<string> {
    return await this.descriptionInput.getAttribute('value');
  }

  async setCreatedByInput(createdBy: string): Promise<void> {
    await this.createdByInput.sendKeys(createdBy);
  }

  async getCreatedByInput(): Promise<string> {
    return await this.createdByInput.getAttribute('value');
  }

  async setCreatedDateInput(createdDate: string): Promise<void> {
    await this.createdDateInput.sendKeys(createdDate);
  }

  async getCreatedDateInput(): Promise<string> {
    return await this.createdDateInput.getAttribute('value');
  }

  async setLastModifiedByInput(lastModifiedBy: string): Promise<void> {
    await this.lastModifiedByInput.sendKeys(lastModifiedBy);
  }

  async getLastModifiedByInput(): Promise<string> {
    return await this.lastModifiedByInput.getAttribute('value');
  }

  async setLastModifiedDateInput(lastModifiedDate: string): Promise<void> {
    await this.lastModifiedDateInput.sendKeys(lastModifiedDate);
  }

  async getLastModifiedDateInput(): Promise<string> {
    return await this.lastModifiedDateInput.getAttribute('value');
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  getSaveButton(): ElementFinder {
    return this.saveButton;
  }
}

export class UrlDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-url-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-url'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
