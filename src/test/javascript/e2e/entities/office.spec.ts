import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('Office e2e test', () => {

    let navBarPage: NavBarPage;
    let officeDialogPage: OfficeDialogPage;
    let officeComponentsPage: OfficeComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load Offices', () => {
        navBarPage.goToEntity('office');
        officeComponentsPage = new OfficeComponentsPage();
        expect(officeComponentsPage.getTitle()).toMatch(/mallApp.office.home.title/);

    });

    it('should load create Office dialog', () => {
        officeComponentsPage.clickOnCreateButton();
        officeDialogPage = new OfficeDialogPage();
        expect(officeDialogPage.getModalTitle()).toMatch(/mallApp.office.home.createOrEditLabel/);
        officeDialogPage.close();
    });

    it('should create and save Offices', () => {
        officeComponentsPage.clickOnCreateButton();
        officeDialogPage.setCodeInput('code');
        expect(officeDialogPage.getCodeInput()).toMatch('code');
        officeDialogPage.setNameInput('name');
        expect(officeDialogPage.getNameInput()).toMatch('name');
        officeDialogPage.statusSelectLastOption();
        officeDialogPage.addressSelectLastOption();
        officeDialogPage.save();
        expect(officeDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class OfficeComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-office div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class OfficeDialogPage {
    modalTitle = element(by.css('h4#myOfficeLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    codeInput = element(by.css('input#field_code'));
    nameInput = element(by.css('input#field_name'));
    statusSelect = element(by.css('select#field_status'));
    addressSelect = element(by.css('select#field_address'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setCodeInput = function(code) {
        this.codeInput.sendKeys(code);
    }

    getCodeInput = function() {
        return this.codeInput.getAttribute('value');
    }

    setNameInput = function(name) {
        this.nameInput.sendKeys(name);
    }

    getNameInput = function() {
        return this.nameInput.getAttribute('value');
    }

    setStatusSelect = function(status) {
        this.statusSelect.sendKeys(status);
    }

    getStatusSelect = function() {
        return this.statusSelect.element(by.css('option:checked')).getText();
    }

    statusSelectLastOption = function() {
        this.statusSelect.all(by.tagName('option')).last().click();
    }
    addressSelectLastOption = function() {
        this.addressSelect.all(by.tagName('option')).last().click();
    }

    addressSelectOption = function(option) {
        this.addressSelect.sendKeys(option);
    }

    getAddressSelect = function() {
        return this.addressSelect;
    }

    getAddressSelectedOption = function() {
        return this.addressSelect.element(by.css('option:checked')).getText();
    }

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
