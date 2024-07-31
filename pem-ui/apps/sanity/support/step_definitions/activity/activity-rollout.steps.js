//import { Then, When } from '@cucumber/cucumber';
const { createBdd } = require('playwright-bdd');
const { Then, When } = createBdd();
const { DataUtils } = require('../../../utils/DataUtils');
const dataUtils = new DataUtils();
const { PageConstants } = require('../../PageConstants');

Then('Verify activity current status is Final and Rollout Button is enable', async function ({ context }) {
  let newPage = await dataUtils.getPage(context, 'PEM');
  const newPageConstants = new PageConstants(newPage);
  await newPageConstants.activityListPage.rolloutBtnEnable();
});

Then('Verify Rollout model', async function ({ context }) {
  let newPage = await dataUtils.getPage(context, 'PEM');
  const newPageConstants = new PageConstants(newPage);
  await newPageConstants.activityListPage.activityRollout();
});

When('User Fill Rollout details for Internal Users', async function ({ context }) {
  let newPage = await dataUtils.getPage(context, 'PEM');
  const newPageConstants = new PageConstants(newPage);
  await newPageConstants.rolloutWizard.activityRolloutFillDetail();
});
