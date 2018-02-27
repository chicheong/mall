import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('ProductStyleHistory e2e test', () => {

    let navBarPage: NavBarPage;
    let productStyleHistoryDialogPage: ProductStyleHistoryDialogPage;
    let productStyleHistoryComponentsPage: ProductStyleHistoryComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load ProductStyleHistories', () => {
        navBarPage.goToEntity('product-style-history');
        productStyleHistoryComponentsPage = new ProductStyleHistoryComponentsPage();
        expect(productStyleHistoryComponentsPage.getTitle())
            .toMatch(/mallApp.productStyleHistory.home.title/);

    });

    it('should load create ProductStyleHistory dialog', () => {
        productStyleHistoryComponentsPage.clickOnCreateButton();
        productStyleHistoryDialogPage = new ProductStyleHistoryDialogPage();
        expect(productStyleHistoryDialogPage.getModalTitle())
            .toMatch(/mallApp.productStyleHistory.home.createOrEditLabel/);
        productStyleHistoryDialogPage.close();
    });

    it('should create and save ProductStyleHistories', () => {
        productStyleHistoryComponentsPage.clickOnCreateButton();
        productStyleHistoryDialogPage.setNameInput('name');
        expect(productStyleHistoryDialogPage.getNameInput()).toMatch('name');
        productStyleHistoryDialogPage.setCodeInput('code');
        expect(productStyleHistoryDialogPage.getCodeInput()).toMatch('code');
        productStyleHistoryDialogPage.getIsDefaultInput().isSelected().then((selected) => {
            if (selected) {
                productStyleHistoryDialogPage.getIsDefaultInput().click();
                expect(productStyleHistoryDialogPage.getIsDefaultInput().isSelected()).toBeFalsy();
            } else {
                productStyleHistoryDialogPage.getIsDefaultInput().click();
                expect(productStyleHistoryDialogPage.getIsDefaultInput().isSelected()).toBeTruthy();
            }
        });
        productStyleHistoryDialogPage.typeSelectLastOption();
        productStyleHistoryDialogPage.setCreatedByInput('createdBy');
        expect(productStyleHistoryDialogPage.getCreatedByInput()).toMatch('createdBy');
        productStyleHistoryDialogPage.setCreatedDateInput(12310020012301);
        expect(productStyleHistoryDialogPage.getCreatedDateInput()).toMatch('2001-12-31T02:30');
        productStyleHistoryDialogPage.save();
        expect(productStyleHistoryDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class ProductStyleHistoryComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-product-style-history div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class ProductStyleHistoryDialogPage {
    modalTitle = element(by.css('h4#myProductStyleHistoryLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    nameInput = element(by.css('input#field_name'));
    codeInput = element(by.css('input#field_code'));
    isDefaultInput = element(by.css('input#field_isDefault'));
    typeSelect = element(by.css('select#field_type'));
    createdByInput = element(by.css('input#field_createdBy'));
    createdDateInput = element(by.css('input#field_createdDate'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setNameInput = function(name) {
        this.nameInput.sendKeys(name);
    };

    getNameInput = function() {
        return this.nameInput.getAttribute('value');
    };

    setCodeInput = function(code) {
        this.codeInput.sendKeys(code);
    };

    getCodeInput = function() {
        return this.codeInput.getAttribute('value');
    };

    getIsDefaultInput = function() {
        return this.isDefaultInput;
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
    setCreatedByInput = function(createdBy) {
        this.createdByInput.sendKeys(createdBy);
    };

    getCreatedByInput = function() {
        return this.createdByInput.getAttribute('value');
    };

    setCreatedDateInput = function(createdDate) {
        this.createdDateInput.sendKeys(createdDate);
    };

    getCreatedDateInput = function() {
        return this.createdDateInput.getAttribute('value');
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
