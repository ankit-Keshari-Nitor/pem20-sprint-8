import { Given, Then } from '@cucumber/cucumber';
import NewActivity from '../page_objects/activity/new-activity.po.js';

Given('User fill the definition details for new activity', { timeout: 10 * 1000 }, async function () {
  const newActivity = new NewActivity(this.page);
  await newActivity.fillActivityDefination();
});

Given('User drags {string} block and fills details on definition tab', async function (blockName) {
  // ------------------------------------- Task Drag and Drop ----------------------------------------------------
  const newActivity = new NewActivity(this.page);
  //await this.page.waitForTimeout(30);
  await newActivity.dragBlock(blockName);
  await newActivity.fillsDetails(blockName);
});

Given('User connects {string} node and {string} node', async function (startTaskNode, endTaskNode) {
  const newActivity = new NewActivity(this.page);
  await newActivity.connectTaskNode(startTaskNode, endTaskNode);
});



Given('User fill the exit validation for {string}', async function (blockName) {
  const newActivity = new NewActivity(this.page);
  //await this.page.waitForTimeout(30);
  await newActivity.exitCondition();
});

Given('User connects start node to {string} node and {string} node to end node', async function (startNode, endNode) {
  const newActivity = new NewActivity(this.page);
  //await this.page.waitForTimeout(30);
  await newActivity.connectsNode(startNode, endNode);
});

Given('User save the new activity', async function () {
  const newActivity = new NewActivity(this.page);
  //await this.page.waitForTimeout(30);
  await newActivity.saveActivity();
});

Then('User verifies activity list page after save completion', async function () {
  const newActivity = new NewActivity(this.page);
  //await this.page.waitForTimeout(30);
  await newActivity.activityVerify();
})
