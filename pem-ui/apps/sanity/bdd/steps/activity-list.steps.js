import { Then } from '@cucumber/cucumber';
import ActicityList from '../page_objects/activity/activity-list.po.js';

Then('Verify default page {string} is displayed in [Page][{string}]', { timeout: 10 * 1000 }, async function (pageNo, pageId) {
    const activityList = new ActicityList(this.page);
    await activityList.verifyPageNumber(pageNo);
});

Then('Verify pagination with default page {string} is displayed in [Page][{string}]', { timeout: 10 * 1000 }, async function (pageNo, pageId) {
    const activityList = new ActicityList(this.page);
    await activityList.pagination(pageNo);
});

Then('Verify perpage rows are displayed in [Page][{string}]', { timeout: 10 * 1000 }, async function (pageId) {
    const activityList = new ActicityList(this.page);
    await activityList.perPageRows();
});

Then('Verify activity current status is Draft and Mark as final Button is enable', { timeout: 10 * 1000 }, async function () {
    const activityList = new ActicityList(this.page);
    await activityList.markAsFinalBtnEnable();
})

Then('Verify Mark as final functionality', { timeout: 10 * 1000 }, async function () {
    const activityList = new ActicityList(this.page);
    await activityList.activityMarkAsFinal();
})

Then('Verify activity current status is Delete and Restore Button is enable', { timeout: 10 * 1000 }, async function () {
    const activityList = new ActicityList(this.page);
    await activityList.restoreBtnEnable();
})

Then('Verify Restore functionality', { timeout: 10 * 1000 }, async function () {
    const activityList = new ActicityList(this.page);
    await activityList.activityRestore();
})

Then('Verify activity details page is loaded in readonly mode on click of view button from ellipse menu in [Page][{string}]', { timeout: 10 * 1000 }, async function (pageId) {
    const activityList = new ActicityList(this.page);
    await activityList.activityView();
})

Then('Verify activity details page is loaded on click of edit button from ellipse menu in [Page][{string}]', { timeout: 10 * 1000 }, async function (pageId) {
    const activityList = new ActicityList(this.page);
    await activityList.activityEdit();
})

// Then('Verify activity version drawer is opened on click of version history icon', { timeout: 10 * 1000 }, async function () {
//     const activityList = new ActicityList(this.page);
//     await activityList.activityVersionDrawer();
// })
