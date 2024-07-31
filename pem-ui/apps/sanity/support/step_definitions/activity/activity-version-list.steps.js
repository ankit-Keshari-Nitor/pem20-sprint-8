//import { Then, When } from '@cucumber/cucumber';
const { createBdd } = require('playwright-bdd');
const { Then, When } = createBdd();
const { DataUtils } = require('../../../utils/DataUtils');
const dataUtils = new DataUtils();
const { PageConstants } = require('../../PageConstants');

When('User open version drawer by click of version history icon', async function ({ context }) {
  let newPage = await dataUtils.getPage(context, 'PEM');
  const newPageConstants = new PageConstants(newPage);
  const activityItem = await newPageConstants.activityListPage.activityRow('Final');
  await newPageConstants.activityVersionDrawer.openVersionDrawer(activityItem);
});

Then('Verify activity version list default page {string} is displayed in [Page][{string}]', async function ({ context }, pageNo, pageId) {
  let newPage = await dataUtils.getPage(context, 'PEM');
  const newPageConstants = new PageConstants(newPage);
  await newPageConstants.activityVersionDrawer.versionListVerifyPageNumber(pageNo);
});

Then('Verify activity version list pagination with default page {string} is displayed in [Page][{string}]', async function ({ context }, pageNo, pageId) {
  let newPage = await dataUtils.getPage(context, 'PEM');
  const newPageConstants = new PageConstants(newPage);
  await newPageConstants.activityVersionDrawer.versionPagination(pageNo);
});

Then('Verify activity version list perpage rows are displayed in [Page][{string}]', async function ({ context }, pageId) {
  let newPage = await dataUtils.getPage(context, 'PEM');
  const newPageConstants = new PageConstants(newPage);
  await newPageConstants.activityVersionDrawer.versionPerPageRows();
});

Then('Verify version current status is Final and Rollout Button is enable', async function ({ context }) {
  let newPage = await dataUtils.getPage(context, 'PEM');
  const newPageConstants = new PageConstants(newPage);
  await newPageConstants.activityVersionDrawer.rolloutBtnEnable();
});

Then('Verify version Rollout functionality', async function ({ context }) {
  let newPage = await dataUtils.getPage(context, 'PEM');
  const newPageConstants = new PageConstants(newPage);
  await newPageConstants.activityVersionDrawer.versionRollout();
});

Then('Verify version current status is Draft and Mark as final Button is enable', async function ({ context }) {
  let newPage = await dataUtils.getPage(context, 'PEM');
  const newPageConstants = new PageConstants(newPage);
  await newPageConstants.activityVersionDrawer.markAsFinalBtnEnable();
});

Then('Verify version Mark as final functionality', async function ({ context }) {
  let newPage = await dataUtils.getPage(context, 'PEM');
  const newPageConstants = new PageConstants(newPage);
  await newPageConstants.activityVersionDrawer.versionMarkAsFinal();
});

Then('Verify version current status is Delete and Restore Button is enable', async function ({ context }) {
  let newPage = await dataUtils.getPage(context, 'PEM');
  const newPageConstants = new PageConstants(newPage);
  await newPageConstants.activityVersionDrawer.restoreBtnEnable();
});

Then('Verify version Restore functionality', async function ({ context }) {
  let newPage = await dataUtils.getPage(context, 'PEM');
  const newPageConstants = new PageConstants(newPage);
  await newPageConstants.activityVersionDrawer.versionRestore();
});

Then('Verify activities version list to view the activity in [Page][{string}]', async function ({ context }) {
  let newPage = await dataUtils.getPage(context, 'PEM');
  const newPageConstants = new PageConstants(newPage);
  await newPageConstants.activityVersionDrawer.activityVersionView();
});

Then('Verify activities version list to edit the activity in [Page][{string}]', async function ({ context }) {
  let newPage = await dataUtils.getPage(context, 'PEM');
  const newPageConstants = new PageConstants(newPage);
  await newPageConstants.activityVersionDrawer.activityVersionEdit();
});