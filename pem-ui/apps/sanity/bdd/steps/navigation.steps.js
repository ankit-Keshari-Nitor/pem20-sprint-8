import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

When('User navigates to {string} of {string} [App-Nav]', async function (subMenu,menu) {
  await this.page.locator('.cds--header__menu-bar li a').filter({ hasText: menu }).click();
  await this.page.locator('.cds--side-nav__item a .cds--side-nav__link-text').filter({ hasText: subMenu }).click();
  await this.page.locator('[data-testid="side-nav-toggle-button"]').click();
});


Then('User verifies {string} is displayed as current breadscrumb on [Page][{string}]', async function (breadscrumb, pageId) {
  const textEle = await this.page.locator(`.cds--breadcrumb .cds--breadcrumb-item--current a`).filter({ hasText: breadscrumb });
  await expect(textEle).toBeVisible();
  const text = await textEle.textContent();
  await expect(text).toBe(breadscrumb);
});
