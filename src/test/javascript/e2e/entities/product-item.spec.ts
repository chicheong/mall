import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('ProductItem e2e test', () => {

    let navBarPage: NavBarPage;
    let productItemDialogPage: ProductItemDialogPage;
    let productItemComponentsPage: ProductItemComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load ProductItems', () => {
        navBarPage.goToEntity('product-item');
        productItemComponentsPage = new ProductItemComponentsPage();
        expect(productItemComponentsPage.getTitle())
            .toMatch(/mallApp.productItem.home.title/);

    });

    it('should load create ProductItem dialog', () => {
        productItemComponentsPage.clickOnCreateButton();
        productItemDialogPage = new ProductItemDialogPage();
        expect(productItemDialogPage.getModalTitle())
            .toMatch(/mallApp.productItem.home.createOrEditLabel/);
        productItemDialogPage.close();
    });

    it('should create and save ProductItems', () => {
        productItemComponentsPage.clickOnCreateButton();
        productItemDialogPage.setCodeInput('code');
        expect(productItemDialogPage.getCodeInput()).toMatch('code');
        productItemDialogPage.getIsDefaultInput().isSelected().then((selected) => {
            if (selected) {
                productItemDialogPage.getIsDefaultInput().click();
                expect(productItemDialogPage.getIsDefaultInput().isSelected()).toBeFalsy();
            } else {
                productItemDialogPage.getIsDefaultInput().click();
                expect(productItemDialogPage.getIsDefaultInput().isSelected()).toBeTruthy();
            }
        });
        productItemDialogPage.setQuantityInput('5');
        expect(productItemDialogPage.getQuantityInput()).toMatch('5');
        productItemDialogPage.currencySelectLastOption();
        productItemDialogPage.setPriceInput('5');
        expect(productItemDialogPage.getPriceInput()).toMatch('5');
        productItemDialogPage.colorSelectLastOption();
        productItemDialogPage.sizeSelectLastOption();
        productItemDialogPage.productSelectLastOption();
        productItemDialogPage.save();
        expect(productItemDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class ProductItemComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-product-item div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class ProductItemDialogPage {
    modalTitle = element(by.css('h4#myProductItemLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    codeInput = element(by.css('input#field_code'));
    isDefaultInput = element(by.css('input#field_isDefault'));
    quantityInput = element(by.css('input#field_quantity'));
    currencySelect = element(by.css('select#field_currency'));
    priceInput = element(by.css('input#field_price'));
    colorSelect = element(by.css('select#field_color'));
    sizeSelect = element(by.css('select#field_size'));
    productSelect = element(by.css('select#field_product'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setCodeInput = function(code) {
        this.codeInput.sendKeys(code);
    };

    getCodeInput = function() {
        return this.codeInput.getAttribute('value');
    };
    getIsDefaultInput = function() {
        return this.isDefaultInput;
    }
    setQuantityInput = function(quantity) {
        this.quantityInput.sendKeys(quantity);
    };

    getQuantityInput = function() {
        return this.quantityInput.getAttribute('value');
    };

    setCurrencySelect = function(currency) {
        this.currencySelect.sendKeys(currency);
    };

    getCurrencySelect = function() {
        return this.currencySelect.element(by.css('option:checked')).getText();
    };

    currencySelectLastOption = function() {
        this.currencySelect.all(by.tagName('option')).last().click();
    };
    setPriceInput = function(price) {
        this.priceInput.sendKeys(price);
    };

    getPriceInput = function() {
        return this.priceInput.getAttribute('value');
    };
    colorSelectLastOption = function() {
        this.colorSelect.all(by.tagName('option')).last().click();
    }

    colorSelectOption = function(option) {
        this.colorSelect.sendKeys(option);
    }

    getColorSelect = function() {
        return this.colorSelect;
    }

    getColorSelectedOption = function() {
        return this.colorSelect.element(by.css('option:checked')).getText();
    }

    sizeSelectLastOption = function() {
        this.sizeSelect.all(by.tagName('option')).last().click();
    }

    sizeSelectOption = function(option) {
        this.sizeSelect.sendKeys(option);
    }

    getSizeSelect = function() {
        return this.sizeSelect;
    }

    getSizeSelectedOption = function() {
        return this.sizeSelect.element(by.css('option:checked')).getText();
    }
    productSelectLastOption = function() {
        this.productSelect.all(by.tagName('option')).last().click();
    };

    productSelectOption = function(option) {
        this.productSelect.sendKeys(option);
    };

    getProductSelect = function() {
        return this.productSelect;
    };

    getProductSelectedOption = function() {
        return this.productSelect.element(by.css('option:checked')).getText();
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
