import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('Url e2e test', () => {

    let navBarPage: NavBarPage;
    let urlDialogPage: UrlDialogPage;
    let urlComponentsPage: UrlComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load Urls', () => {
        navBarPage.goToEntity('url');
        urlComponentsPage = new UrlComponentsPage();
        expect(urlComponentsPage.getTitle())
            .toMatch(/mallApp.url.home.title/);

    });

    it('should load create Url dialog', () => {
        urlComponentsPage.clickOnCreateButton();
        urlDialogPage = new UrlDialogPage();
        expect(urlDialogPage.getModalTitle())
            .toMatch(/mallApp.url.home.createOrEditLabel/);
        urlDialogPage.close();
    });

    it('should create and save Urls', () => {
        urlComponentsPage.clickOnCreateButton();
        urlDialogPage.setEntityTypeInput('entityType');
        expect(urlDialogPage.getEntityTypeInput()).toMatch('entityType');
        urlDialogPage.setEntityIdInput('5');
        expect(urlDialogPage.getEntityIdInput()).toMatch('5');
        urlDialogPage.setPathInput('path');
        expect(urlDialogPage.getPathInput()).toMatch('path');
        urlDialogPage.setDescriptionInput('description');
        expect(urlDialogPage.getDescriptionInput()).toMatch('description');
        urlDialogPage.setCreatedByInput('createdBy');
        expect(urlDialogPage.getCreatedByInput()).toMatch('createdBy');
        urlDialogPage.setCreatedDateInput(12310020012301);
        expect(urlDialogPage.getCreatedDateInput()).toMatch('2001-12-31T02:30');
        urlDialogPage.setLastModifiedByInput('lastModifiedBy');
        expect(urlDialogPage.getLastModifiedByInput()).toMatch('lastModifiedBy');
        urlDialogPage.setLastModifiedDateInput(12310020012301);
        expect(urlDialogPage.getLastModifiedDateInput()).toMatch('2001-12-31T02:30');
        urlDialogPage.save();
        expect(urlDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class UrlComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-url div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class UrlDialogPage {
    modalTitle = element(by.css('h4#myUrlLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    entityTypeInput = element(by.css('input#field_entityType'));
    entityIdInput = element(by.css('input#field_entityId'));
    pathInput = element(by.css('input#field_path'));
    descriptionInput = element(by.css('input#field_description'));
    createdByInput = element(by.css('input#field_createdBy'));
    createdDateInput = element(by.css('input#field_createdDate'));
    lastModifiedByInput = element(by.css('input#field_lastModifiedBy'));
    lastModifiedDateInput = element(by.css('input#field_lastModifiedDate'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setEntityTypeInput = function(entityType) {
        this.entityTypeInput.sendKeys(entityType);
    };

    getEntityTypeInput = function() {
        return this.entityTypeInput.getAttribute('value');
    };

    setEntityIdInput = function(entityId) {
        this.entityIdInput.sendKeys(entityId);
    };

    getEntityIdInput = function() {
        return this.entityIdInput.getAttribute('value');
    };

    setPathInput = function(path) {
        this.pathInput.sendKeys(path);
    };

    getPathInput = function() {
        return this.pathInput.getAttribute('value');
    };

    setDescriptionInput = function(description) {
        this.descriptionInput.sendKeys(description);
    };

    getDescriptionInput = function() {
        return this.descriptionInput.getAttribute('value');
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
