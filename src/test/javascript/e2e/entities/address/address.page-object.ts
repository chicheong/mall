import { element, by, ElementFinder } from 'protractor';

export class AddressComponentsPage {
    createButton = element(by.id('jh-create-entity'));
    deleteButtons = element.all(by.css('jhi-address div table .btn-danger'));
    title = element.all(by.css('jhi-address div h2#page-heading span')).first();

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

export class AddressUpdatePage {
    pageTitle = element(by.id('jhi-address-heading'));
    saveButton = element(by.id('save-entity'));
    cancelButton = element(by.id('cancel-save'));
    line1Input = element(by.id('field_line1'));
    line2Input = element(by.id('field_line2'));
    line3Input = element(by.id('field_line3'));
    line4Input = element(by.id('field_line4'));
    cityInput = element(by.id('field_city'));
    postalCodeInput = element(by.id('field_postalCode'));
    countrySelect = element(by.id('field_country'));
    stateSelect = element(by.id('field_state'));

    async getPageTitle() {
        return this.pageTitle.getAttribute('jhiTranslate');
    }

    async setLine1Input(line1) {
        await this.line1Input.sendKeys(line1);
    }

    async getLine1Input() {
        return this.line1Input.getAttribute('value');
    }

    async setLine2Input(line2) {
        await this.line2Input.sendKeys(line2);
    }

    async getLine2Input() {
        return this.line2Input.getAttribute('value');
    }

    async setLine3Input(line3) {
        await this.line3Input.sendKeys(line3);
    }

    async getLine3Input() {
        return this.line3Input.getAttribute('value');
    }

    async setLine4Input(line4) {
        await this.line4Input.sendKeys(line4);
    }

    async getLine4Input() {
        return this.line4Input.getAttribute('value');
    }

    async setCityInput(city) {
        await this.cityInput.sendKeys(city);
    }

    async getCityInput() {
        return this.cityInput.getAttribute('value');
    }

    async setPostalCodeInput(postalCode) {
        await this.postalCodeInput.sendKeys(postalCode);
    }

    async getPostalCodeInput() {
        return this.postalCodeInput.getAttribute('value');
    }

    async countrySelectLastOption() {
        await this.countrySelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    async countrySelectOption(option) {
        await this.countrySelect.sendKeys(option);
    }

    getCountrySelect(): ElementFinder {
        return this.countrySelect;
    }

    async getCountrySelectedOption() {
        return this.countrySelect.element(by.css('option:checked')).getText();
    }

    async stateSelectLastOption() {
        await this.stateSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    async stateSelectOption(option) {
        await this.stateSelect.sendKeys(option);
    }

    getStateSelect(): ElementFinder {
        return this.stateSelect;
    }

    async getStateSelectedOption() {
        return this.stateSelect.element(by.css('option:checked')).getText();
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

export class AddressDeleteDialog {
    private dialogTitle = element(by.id('jhi-delete-address-heading'));
    private confirmButton = element(by.id('jhi-confirm-delete-address'));

    async getDialogTitle() {
        return this.dialogTitle.getAttribute('jhiTranslate');
    }

    async clickOnConfirmButton() {
        await this.confirmButton.click();
    }
}
