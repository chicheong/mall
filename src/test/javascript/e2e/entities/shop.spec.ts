import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('Shop e2e test', () => {

    let navBarPage: NavBarPage;
    let shopDialogPage: ShopDialogPage;
    let shopComponentsPage: ShopComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load Shops', () => {
        navBarPage.goToEntity('shop');
        shopComponentsPage = new ShopComponentsPage();
        expect(shopComponentsPage.getTitle())
            .toMatch(/mallApp.shop.home.title/);

    });

    it('should load create Shop dialog', () => {
        shopComponentsPage.clickOnCreateButton();
        shopDialogPage = new ShopDialogPage();
        expect(shopDialogPage.getModalTitle())
            .toMatch(/mallApp.shop.home.createOrEditLabel/);
        shopDialogPage.close();
    });

    it('should create and save Shops', () => {
        shopComponentsPage.clickOnCreateButton();
        shopDialogPage.setCodeInput('code');
        expect(shopDialogPage.getCodeInput()).toMatch('code');
        shopDialogPage.setNameInput('name');
        expect(shopDialogPage.getNameInput()).toMatch('name');
        shopDialogPage.setDescriptionInput('description');
        expect(shopDialogPage.getDescriptionInput()).toMatch('description');
        shopDialogPage.statusSelectLastOption();
        shopDialogPage.setCreatedByInput('createdBy');
        expect(shopDialogPage.getCreatedByInput()).toMatch('createdBy');
        shopDialogPage.setCreatedDateInput(12310020012301);
        expect(shopDialogPage.getCreatedDateInput()).toMatch('2001-12-31T02:30');
        shopDialogPage.setLastModifiedByInput('lastModifiedBy');
        expect(shopDialogPage.getLastModifiedByInput()).toMatch('lastModifiedBy');
        shopDialogPage.setLastModifiedDateInput(12310020012301);
        expect(shopDialogPage.getLastModifiedDateInput()).toMatch('2001-12-31T02:30');
        shopDialogPage.save();
        expect(shopDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class ShopComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-shop div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class ShopDialogPage {
    modalTitle = element(by.css('h4#myShopLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    codeInput = element(by.css('input#field_code'));
    nameInput = element(by.css('input#field_name'));
    descriptionInput = element(by.css('input#field_description'));
    statusSelect = element(by.css('select#field_status'));
    createdByInput = element(by.css('input#field_createdBy'));
    createdDateInput = element(by.css('input#field_createdDate'));
    lastModifiedByInput = element(by.css('input#field_lastModifiedBy'));
    lastModifiedDateInput = element(by.css('input#field_lastModifiedDate'));

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

    setDescriptionInput = function(description) {
        this.descriptionInput.sendKeys(description);
    };

    getDescriptionInput = function() {
        return this.descriptionInput.getAttribute('value');
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

    setLastModifiedByInput = function(lastModifiedBy) {
        this.lastModifiedByInput.sendKeys(lastModifiedBy);
    };

    getLastModifiedByInput = function() {
        return this.lastModifiedByInput.getAttribute('value');
    };

    setLastModifiedDateInput = function(lastModifiedDate) {
        this.lastModifiedDateInput.sendKeys(lastModifiedDate);
    };

    getLastModifiedDateInput = function() {
        return this.lastModifiedDateInput.getAttribute('value');
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
