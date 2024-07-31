const { createBdd } = require('playwright-bdd');
const { Then } = createBdd();
const { DataUtils } = require('../../../utils/DataUtils');
const dataUtils = new DataUtils();
const { PageConstants } = require('../../PageConstants');

Then('Verify default page {string} is displayed in [Page][{string}]', async function ({ context }, pageNo, pageId) {
  let newPage = await dataUtils.getPage(context, 'PEM');
  const newPageConstants = new PageConstants(newPage);
  await newPageConstants.activityListPage.verifyPageNumber(pageNo);
});

Then('Verify pagination with default page {string} is displayed in [Page][{string}]', async function ({ context }, pageNo, pageId) {
  let newPage = await dataUtils.getPage(context, 'PEM');
  const newPageConstants = new PageConstants(newPage);
  await newPageConstants.activityListPage.pagination(pageNo);
});

Then('Verify perpage rows are displayed in [Page][{string}]', async function ({ context }, pageId) {
  let newPage = await dataUtils.getPage(context, 'PEM');
  const newPageConstants = new PageConstants(newPage);
  await newPageConstants.activityListPage.perPageRows();
});

Then('Verify activity current status is Draft and Mark as final Button is enable', async function ({ context }) {
  let newPage = await dataUtils.getPage(context, 'PEM');
  const newPageConstants = new PageConstants(newPage);
  await newPageConstants.activityListPage.markAsFinalBtnEnable();
});

Then('Verify Mark as final functionality', async function ({ context }) {
  let newPage = await dataUtils.getPage(context, 'PEM');
  const newPageConstants = new PageConstants(newPage);
  await newPageConstants.activityListPage.activityMarkAsFinal();
});
/*
Then('Verify activity current status is Delete and Restore Button is enable', async function ({ context }) {
  let newPage = await dataUtils.getPage(context, 'PEM');
  const newPageConstants = new PageConstants(newPage);
  await newPageConstants.activityListPage.restoreBtnEnable();
});

Then('Verify Restore functionality', async function ({ context }) {
  let newPage = await dataUtils.getPage(context, 'PEM');
  const newPageConstants = new PageConstants(newPage);
  await newPageConstants.activityListPage.activityRestore();
});

Then('Verify activity details page is loaded in readonly mode on click of view button from ellipse menu in [Page][{string}]', async function ({ context }) {
  let newPage = await dataUtils.getPage(context, 'PEM');
  const newPageConstants = new PageConstants(newPage);
  await newPageConstants.activityListPage.activityView();
});

Then('Verify activity details page is loaded on click of edit button from ellipse menu in [Page][{string}]', async function ({ context }) {
  let newPage = await dataUtils.getPage(context, 'PEM');
  const newPageConstants = new PageConstants(newPage);
  await newPageConstants.activityListPage.activityEdit();
});

Then('Verify activity version drawer is opened on click of version history icon', async function ({ context }) {
  let newPage = await dataUtils.getPage(context, 'PEM');
  const newPageConstants = new PageConstants(newPage);
  await newPageConstants.activityListPage.activityVersionDrawer();
});
*/