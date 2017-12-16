import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('Company e2e test', () => {

    let navBarPage: NavBarPage;
    let companyDialogPage: CompanyDialogPage;
    let companyComponentsPage: CompanyComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load Companies', () => {
        navBarPage.goToEntity('company');
        companyComponentsPage = new CompanyComponentsPage();
        expect(companyComponentsPage.getTitle()).toMatch(/mallApp.company.home.title/);

    });

    it('should load create Company dialog', () => {
        companyComponentsPage.clickOnCreateButton();
        companyDialogPage = new CompanyDialogPage();
        expect(companyDialogPage.getModalTitle()).toMatch(/mallApp.company.home.createOrEditLabel/);
        companyDialogPage.close();
    });

    it('should create and save Companies', () => {
        companyComponentsPage.clickOnCreateButton();
        companyDialogPage.setCodeInput('code');
        expect(companyDialogPage.getCodeInput()).toMatch('code');
        companyDialogPage.setNameInput('name');
        expect(companyDialogPage.getNameInput()).toMatch('name');
        companyDialogPage.statusSelectLastOption();
        companyDialogPage.parentSelectLastOption();
        // companyDialogPage.departmentSelectLastOption();
        // companyDialogPage.officeSelectLastOption();
        companyDialogPage.save();
        expect(companyDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class CompanyComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-company div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class CompanyDialogPage {
    modalTitle = element(by.css('h4#myCompanyLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    codeInput = element(by.css('input#field_code'));
    nameInput = element(by.css('input#field_name'));
    statusSelect = element(by.css('select#field_status'));
    parentSelect = element(by.css('select#field_parent'));
    departmentSelect = element(by.css('select#field_department'));
    officeSelect = element(by.css('select#field_office'));

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
    parentSelectLastOption = function() {
        this.parentSelect.all(by.tagName('option')).last().click();
    }

    parentSelectOption = function(option) {
        this.parentSelect.sendKeys(option);
    }

    getParentSelect = function() {
        return this.parentSelect;
    }

    getParentSelectedOption = function() {
        return this.parentSelect.element(by.css('option:checked')).getText();
    }

    departmentSelectLastOption = function() {
        this.departmentSelect.all(by.tagName('option')).last().click();
    }

    departmentSelectOption = function(option) {
        this.departmentSelect.sendKeys(option);
    }

    getDepartmentSelect = function() {
        return this.departmentSelect;
    }

    getDepartmentSelectedOption = function() {
        return this.departmentSelect.element(by.css('option:checked')).getText();
    }

    officeSelectLastOption = function() {
        this.officeSelect.all(by.tagName('option')).last().click();
    }

    officeSelectOption = function(option) {
        this.officeSelect.sendKeys(option);
    }

    getOfficeSelect = function() {
        return this.officeSelect;
    }

    getOfficeSelectedOption = function() {
        return this.officeSelect.element(by.css('option:checked')).getText();
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
