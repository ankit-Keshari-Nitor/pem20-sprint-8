import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

Then('Verify {string} page is displayed [Page][{string}]', async function (pageTitle, pageId) {
  // const textEle = await this.page.locator(`.${pageId}-container .cds--data-table-container .cds--data-table-header .cds--data-table-header__title`);
  // await expect(textEle).toBeVisible();
  // const text = await textEle.textContent();
  const text = await this.page.locator('.header-button-right').textContent();
  await expect(text).toBe(pageTitle);
});

When('User clicks on {string} link in [Page][{string}]', async function (text, pageId) {
  const actionBtn = await this.page.getByText(text);
  await expect(actionBtn).toBeVisible();
  await actionBtn.click();
});

When('User waits for api call for {int}', { timeout: 20 * 1000 }, async function (waitTime) {
  // Write code here that turns the phrase above into concrete actions
  await this.page.waitForTimeout(waitTime);
});

When('User waits for {int} seconds for application to process', { timeout: 20 * 1000 }, async function (waitTime) {
  // Write code here that turns the phrase above into concrete actions
  await this.page.waitForTimeout(waitTime);
});
