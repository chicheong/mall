import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('Department e2e test', () => {

    let navBarPage: NavBarPage;
    let departmentDialogPage: DepartmentDialogPage;
    let departmentComponentsPage: DepartmentComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load Departments', () => {
        navBarPage.goToEntity('department');
        departmentComponentsPage = new DepartmentComponentsPage();
        expect(departmentComponentsPage.getTitle())
            .toMatch(/mallApp.department.home.title/);

    });

    it('should load create Department dialog', () => {
        departmentComponentsPage.clickOnCreateButton();
        departmentDialogPage = new DepartmentDialogPage();
        expect(departmentDialogPage.getModalTitle())
            .toMatch(/mallApp.department.home.createOrEditLabel/);
        departmentDialogPage.close();
    });

    it('should create and save Departments', () => {
        departmentComponentsPage.clickOnCreateButton();
        departmentDialogPage.setCodeInput('code');
        expect(departmentDialogPage.getCodeInput()).toMatch('code');
        departmentDialogPage.setNameInput('name');
        expect(departmentDialogPage.getNameInput()).toMatch('name');
        departmentDialogPage.statusSelectLastOption();
        departmentDialogPage.parentSelectLastOption();
        // departmentDialogPage.officeSelectLastOption();
        departmentDialogPage.save();
        expect(departmentDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class DepartmentComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-department div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class DepartmentDialogPage {
    modalTitle = element(by.css('h4#myDepartmentLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    codeInput = element(by.css('input#field_code'));
    nameInput = element(by.css('input#field_name'));
    statusSelect = element(by.css('select#field_status'));
    parentSelect = element(by.css('select#field_parent'));
    officeSelect = element(by.css('select#field_office'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setCodeInput = function(code) {
        this.codeInput.sendKeys(code);
    };

    getCodeInput = function() {
        return this.codeInput.getAttribute('value');
    };

    setNameInput = function(name) {
        this.nameInput.sendKeys(name);
    };

    getNameInput = function() {
        return this.nameInput.getAttribute('value');
    };

    setStatusSelect = function(status) {
        this.statusSelect.sendKeys(status);
    };

    getStatusSelect = function() {
        return this.statusSelect.element(by.css('option:checked')).getText();
    };

    statusSelectLastOption = function() {
        this.statusSelect.all(by.tagName('option')).last().click();
    };
    parentSelectLastOption = function() {
        this.parentSelect.all(by.tagName('option')).last().click();
    };

    parentSelectOption = function(option) {
        this.parentSelect.sendKeys(option);
    };

    getParentSelect = function() {
        return this.parentSelect;
    };

    getParentSelectedOption = function() {
        return this.parentSelect.element(by.css('option:checked')).getText();
    };

    officeSelectLastOption = function() {
        this.officeSelect.all(by.tagName('option')).last().click();
    };

    officeSelectOption = function(option) {
        this.officeSelect.sendKeys(option);
    };

    getOfficeSelect = function() {
        return this.officeSelect;
    };

    getOfficeSelectedOption = function() {
        return this.officeSelect.element(by.css('option:checked')).getText();
    };

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
