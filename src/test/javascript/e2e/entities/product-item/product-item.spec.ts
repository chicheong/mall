import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { ProductItemComponentsPage, ProductItemDeleteDialog, ProductItemUpdatePage } from './product-item.page-object';

const expect = chai.expect;

describe('ProductItem e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let productItemComponentsPage: ProductItemComponentsPage;
  let productItemUpdatePage: ProductItemUpdatePage;
  let productItemDeleteDialog: ProductItemDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load ProductItems', async () => {
    await navBarPage.goToEntity('product-item');
    productItemComponentsPage = new ProductItemComponentsPage();
    await browser.wait(ec.visibilityOf(productItemComponentsPage.title), 5000);
    expect(await productItemComponentsPage.getTitle()).to.eq('mallApp.productItem.home.title');
    await browser.wait(
      ec.or(ec.visibilityOf(productItemComponentsPage.entities), ec.visibilityOf(productItemComponentsPage.noResult)),
      1000
    );
  });

  it('should load create ProductItem page', async () => {
    await productItemComponentsPage.clickOnCreateButton();
    productItemUpdatePage = new ProductItemUpdatePage();
    expect(await productItemUpdatePage.getPageTitle()).to.eq('mallApp.productItem.home.createOrEditLabel');
    await productItemUpdatePage.cancel();
  });

  it('should create and save ProductItems', async () => {
    const nbButtonsBeforeCreate = await productItemComponentsPage.countDeleteButtons();

    await productItemComponentsPage.clickOnCreateButton();

    await promise.all([
      productItemUpdatePage.setCodeInput('code'),
      productItemUpdatePage.setQuantityInput('5'),
      productItemUpdatePage.currencySelectLastOption(),
      productItemUpdatePage.setPriceInput('5'),
      productItemUpdatePage.colorSelectLastOption(),
      productItemUpdatePage.sizeSelectLastOption(),
      productItemUpdatePage.productSelectLastOption()
    ]);

    expect(await productItemUpdatePage.getCodeInput()).to.eq('code', 'Expected Code value to be equals to code');
    const selectedIsDefault = productItemUpdatePage.getIsDefaultInput();
    if (await selectedIsDefault.isSelected()) {
      await productItemUpdatePage.getIsDefaultInput().click();
      expect(await productItemUpdatePage.getIsDefaultInput().isSelected(), 'Expected isDefault not to be selected').to.be.false;
    } else {
      await productItemUpdatePage.getIsDefaultInput().click();
      expect(await productItemUpdatePage.getIsDefaultInput().isSelected(), 'Expected isDefault to be selected').to.be.true;
    }
    expect(await productItemUpdatePage.getQuantityInput()).to.eq('5', 'Expected quantity value to be equals to 5');
    expect(await productItemUpdatePage.getPriceInput()).to.eq('5', 'Expected price value to be equals to 5');

    await productItemUpdatePage.save();
    expect(await productItemUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await productItemComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last ProductItem', async () => {
    const nbButtonsBeforeDelete = await productItemComponentsPage.countDeleteButtons();
    await productItemComponentsPage.clickOnLastDeleteButton();

    productItemDeleteDialog = new ProductItemDeleteDialog();
    expect(await productItemDeleteDialog.getDialogTitle()).to.eq('mallApp.productItem.delete.question');
    await productItemDeleteDialog.clickOnConfirmButton();

    expect(await productItemComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
