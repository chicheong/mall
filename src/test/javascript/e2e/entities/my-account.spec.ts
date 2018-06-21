import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('MyAccount e2e test', () => {

    let navBarPage: NavBarPage;
    let myAccountDialogPage: MyAccountDialogPage;
    let myAccountComponentsPage: MyAccountComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load MyAccounts', () => {
        navBarPage.goToEntity('my-account');
        myAccountComponentsPage = new MyAccountComponentsPage();
        expect(myAccountComponentsPage.getTitle())
            .toMatch(/mallApp.myAccount.home.title/);

    });

    it('should load create MyAccount dialog', () => {
        myAccountComponentsPage.clickOnCreateButton();
        myAccountDialogPage = new MyAccountDialogPage();
        expect(myAccountDialogPage.getModalTitle())
            .toMatch(/mallApp.myAccount.home.createOrEditLabel/);
        myAccountDialogPage.close();
    });

    it('should create and save MyAccounts', () => {
        myAccountComponentsPage.clickOnCreateButton();
        myAccountDialogPage.setBalanceInput('5');
        expect(myAccountDialogPage.getBalanceInput()).toMatch('5');
        myAccountDialogPage.typeSelectLastOption();
        myAccountDialogPage.companySelectLastOption();
        myAccountDialogPage.departmentSelectLastOption();
        myAccountDialogPage.officeSelectLastOption();
        // myAccountDialogPage.shopSelectLastOption();
        myAccountDialogPage.save();
        expect(myAccountDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class MyAccountComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-my-account div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class MyAccountDialogPage {
    modalTitle = element(by.css('h4#myMyAccountLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    balanceInput = element(by.css('input#field_balance'));
    typeSelect = element(by.css('select#field_type'));
    companySelect = element(by.css('select#field_company'));
    departmentSelect = element(by.css('select#field_department'));
    officeSelect = element(by.css('select#field_office'));
    shopSelect = element(by.css('select#field_shop'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setBalanceInput = function(balance) {
        this.balanceInput.sendKeys(balance);
    };

    getBalanceInput = function() {
        return this.balanceInput.getAttribute('value');
    };

    setTypeSelect = function(type) {
        this.typeSelect.sendKeys(type);
    };

    getTypeSelect = function() {
        return this.typeSelect.element(by.css('option:checked')).getText();
    };

    typeSelectLastOption = function() {
        this.typeSelect.all(by.tagName('option')).last().click();
    };
    companySelectLastOption = function() {
        this.companySelect.all(by.tagName('option')).last().click();
    };

    companySelectOption = function(option) {
        this.companySelect.sendKeys(option);
    };

    getCompanySelect = function() {
        return this.companySelect;
    };

    getCompanySelectedOption = function() {
        return this.companySelect.element(by.css('option:checked')).getText();
    };

    departmentSelectLastOption = function() {
        this.departmentSelect.all(by.tagName('option')).last().click();
    };

    departmentSelectOption = function(option) {
        this.departmentSelect.sendKeys(option);
    };

    getDepartmentSelect = function() {
        return this.departmentSelect;
    };

    getDepartmentSelectedOption = function() {
        return this.departmentSelect.element(by.css('option:checked')).getText();
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

    shopSelectLastOption = function() {
        this.shopSelect.all(by.tagName('option')).last().click();
    };

    shopSelectOption = function(option) {
        this.shopSelect.sendKeys(option);
    };

    getShopSelect = function() {
        return this.shopSelect;
    };

    getShopSelectedOption = function() {
        return this.shopSelect.element(by.css('option:checked')).getText();
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
