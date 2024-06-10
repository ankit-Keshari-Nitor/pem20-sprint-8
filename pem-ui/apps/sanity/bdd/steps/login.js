import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import config from '../test.config.js';

Given('User navigates to the application', { timeout: 10 * 1000 }, async function () {
  //const browser = await chromium.launch({ headless: false });
  //const context = await browser.newContext();
  //this.page = await context.newPage();
  await this.page.goto(config.appUrl);
});