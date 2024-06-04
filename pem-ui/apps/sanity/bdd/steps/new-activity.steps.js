import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

Given('User provides definition details to new activity', { timeout: 10 * 1000 }, async function () {
  const field = await this.page.locator('div.block-properties-container').locator('div.form-field').first().locator('div.cds--text-input-wrapper');
  const wrapper = await field.locator('div.cds--text-input__field-outer-wrapper');
  const inputfield = await wrapper.locator('div.cds--text-input__field-wrapper').locator('[data-testid="activity-name"]').first();
  await expect(inputfield).toBeVisible();
  await inputfield.fill('Demo-Activity');
  await this.page.getByRole('button', { name: 'Save' }).first().click();
});

Given('User adds {string} task to the new activities', { timeout: 10 * 1000 }, async function (activityName) {
  // ------------------------------------- Task Drag and Drop ----------------------------------------------------
  const dropTarget = this.page.locator('div.reactflow-wrapper');
  const dragap = this.page.locator(`div.block-tray .${activityName}`);
  await dragap.dragTo(dropTarget);
  const dragPartner = this.page.locator(`div.block-tray .${activityName}`);
  await dragPartner.dragTo(dropTarget);
  await dragPartner.hover();
  await this.page.mouse.down();
  await this.page.locator(`div.react-flow__node-${activityName}`).click();
  //await this.page.waitForTimeout(20000);

  //  ------------------------------------- Task Define Form ----------------------------------------------------

  await this.page.locator(`div.react-flow__nodes .react-flow__node-${activityName}`).click();
  const topWrapper = await this.page.locator('div.activity-form').locator('div.form-field');

  const nameFieldFormWrapper = await topWrapper.first().locator('div.cds--text-input-wrapper');
  const nameFieldWrapper = await nameFieldFormWrapper.locator('div.cds--text-input__field-outer-wrapper');
  const nameField = await nameFieldWrapper.locator('div.cds--text-input__field-wrapper').locator('[id="name"]').first();
  await expect(nameField).toBeVisible();
  await nameField.fill('Partner-Task');

  const desFormWrapper = await topWrapper.nth(1).locator('div.cds--form-item').first();
  const desFieldWrapper = await desFormWrapper.locator('div.cds--text-area__wrapper');
  const desField = await desFieldWrapper.locator('[id="description"]').first();
  await expect(desField).toBeVisible();
  await desField.fill('Partner-Task-Description');

  const daysFieldFormWrapper = await topWrapper.nth(2).locator('div.cds--text-input-wrapper');
  const daysFieldWrapper = await daysFieldFormWrapper.locator('div.cds--text-input__field-outer-wrapper');
  const fieldWrapper = await daysFieldWrapper.locator('div.cds--text-input__field-wrapper');
  const daysField = await fieldWrapper.locator('[id="estimate_days"]').first();
  await expect(daysField).toBeVisible();
  await daysField.fill('5');

  await this.page.getByRole('button', { name: 'Save' }).first().click();

  // ------------------------------------- Start Edges ----------------------------------------------------
  const startSource = await this.page.locator('div.react-flow__node-start div.react-flow__handle-right');
  await startSource.hover();
  await this.page.mouse.down();

  const startnodeTarget = await this.page.locator(`div.react-flow__node-${activityName} div.react-flow__handle-left`);
  await startnodeTarget.hover();
  await this.page.mouse.up();

  //------------------------------------- End Edges ----------------------------------------------------
  //await this.page.waitForTimeout(10000);
  const endnodeTarget = await this.page.locator(`div.react-flow__node-${activityName} div.react-flow__handle-right`);
  await endnodeTarget.hover();
  await this.page.mouse.down();

  const endSource = await this.page.locator('div.react-flow__node-end div.react-flow__handle-left');
  await endSource.hover();
  await this.page.mouse.up();
});

Given('User save the new activity', { timeout: 10 * 1000 }, async function () {
  const activityBtn = await this.page.locator('div.activity-save a.activity');
  await expect(activityBtn).toBeVisible();
  await activityBtn.click();
});
