import { Then, When } from '@cucumber/cucumber';
import ActivityVersionList from '../page_objects/activity/activity-version-list.po.js';
import ActicityList from '../page_objects/activity/activity-list.po.js';


When('User open version drawer by click of version history icon', { timeout: 10 * 1000 }, async function () {
    const activityList = new ActicityList(this.page);
    const activityItem = await activityList.activityRow("Final");
    const activityVersionList = new ActivityVersionList(this.page);
    await activityVersionList.openVersionDrawer(activityItem);
});

Then('Verify activity version list default page {string} is displayed in [Page][{string}]', { timeout: 10 * 1000 }, async function (pageNo, pageId) {
    const activityVersionList = new ActivityVersionList(this.page);
    await activityVersionList.versionListVerifyPageNumber(pageNo);
});

Then('Verify activity version list pagination with default page {string} is displayed in [Page][{string}]', { timeout: 10 * 1000 }, async function (pageNo, pageId) {
    const activityVersionList = new ActivityVersionList(this.page);
    await activityVersionList.versionPagination(pageNo);
});

Then('Verify activity version list perpage rows are displayed in [Page][{string}]', { timeout: 10 * 1000 }, async function (pageId) {
    const activityVersionList = new ActivityVersionList(this.page);
    await activityVersionList.versionPerPageRows();
});

Then('Verify version current status is Final and Rollout Button is enable', { timeout: 10 * 1000 }, async function () {
    const activityVersionList = new ActivityVersionList(this.page);
    await activityVersionList.rolloutBtnEnable();
})

Then('Verify version Rollout functionality', { timeout: 10 * 1000 }, async function () {
    const activityVersionList = new ActivityVersionList(this.page);
    await activityVersionList.versionRollout();
})

Then('Verify version current status is Draft and Mark as final Button is enable', { timeout: 10 * 1000 }, async function () {
    const activityVersionList = new ActivityVersionList(this.page);
    await activityVersionList.markAsFinalBtnEnable();
})

Then('Verify version Mark as final functionality', { timeout: 10 * 1000 }, async function () {
    const activityVersionList = new ActivityVersionList(this.page);
    await activityVersionList.versionMarkAsFinal();
})

Then('Verify version current status is Delete and Restore Button is enable', { timeout: 10 * 1000 }, async function () {
    const activityVersionList = new ActivityVersionList(this.page);
    await activityVersionList.restoreBtnEnable();
})

Then('Verify version Restore functionality', { timeout: 10 * 1000 }, async function () {
    const activityVersionList = new ActivityVersionList(this.page);
    await activityVersionList.versionRestore();
})

Then('Verify activities version list to view the activity in [Page][{string}]', { timeout: 10 * 1000 }, async function (pageId) {
    const activityVersionList = new ActivityVersionList(this.page);
    await activityVersionList.activityVersionView();
})

Then('Verify activities version list to edit the activity in [Page][{string}]', { timeout: 10 * 1000 }, async function (pageId) {
    const activityVersionList = new ActivityVersionList(this.page);
    await activityVersionList.activityVersionEdit();
})