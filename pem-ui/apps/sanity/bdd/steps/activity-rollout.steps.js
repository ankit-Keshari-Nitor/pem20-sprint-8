import { Then, When } from '@cucumber/cucumber';
import ActicityList from '../page_objects/activity/activity-list.po.js';

Then('Verify activity current status is Final and Rollout Button is enable', { timeout: 10 * 1000 }, async function () {
    const activityList = new ActicityList(this.page);
    await activityList.rolloutBtnEnable();
})

Then('Verify Rollout model', { timeout: 10 * 1000 }, async function () {
    const activityList = new ActicityList(this.page);
    await activityList.activityRollout();
})

When('User Fill Rollout details for Internal Users', { timeout: 10 * 1000 }, async function () {
    const activityList = new ActicityList(this.page);
    await activityList.activityRolloutFillDetail();
})