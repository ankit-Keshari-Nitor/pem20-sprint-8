import { expect } from '@playwright/test';
import DataTable from './data-table.po.js';

class Page {
  constructor(parent, pageName) {
    this.pageName = pageName;
    this.parent = parent;
  }

  async _getPage() {
    if (this.pageName !== undefined) {
      return this.parent.locator(`.sfg--page--${this.pageName}`);
    } else {
      return this.parent;
    }
  }

  async verfiyPageTitle(pageTitle) {
    const text = await this._getPage.locator(`.page-header-container .cds--data-table-header__title`).textContent();
    expect(text).toBe(pageTitle);
  }
  async verifyPageAction(actionName, elementStatus) {
    const pageFooter = await this._getPage().locator(`.sfg--page--actions`);
    expect(pageFooter).toBeVisible();
    const actionBtn = await pageFooter.getByRole('button', { name: actionName });
    checkElementStatus(actionBtn, elementStatus);
  }

  async performPageAction(actionName) {
    const pageFooter = await this._getPage().locator(`.sfg--page--actions`);
    expect(pageFooter).toBeVisible();
    const actionBtn = await pageFooter.getByRole('button', { name: actionName });
    expect(actionBtn).toBeVisible();
    expect(actionBtn).toBeEnabled();
    await actionBtn.click();
  }

  async getDataTable(datatableName) {
    return new DataTable(this.parent, await this._getPage(), datatableName);
  }

  async checkElementStatus(element, status) {
    if (status === 'enabled') {
      return await expect(element).toBeEnabled();
    } else if (status === 'disabled') {
      return await expect(element).toBeDisabled();
    } else if (status === 'visible') {
      return await expect(element).toBeVisible();
    } else if (status === 'hidden') {
      return await expect(element).toBeHidden();
    } else if (status === 'readonly') {
      return await expect(element).not.toBeEditable();
    }
  }
}

const getPage = function (parent, pageName) {
  return new Page(parent, pageName);
};

export default Page;

export { getPage };
