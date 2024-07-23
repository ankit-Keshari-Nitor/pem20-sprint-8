import { expect } from '@playwright/test';

class ActicityList {
    constructor(page) {
        this.page = page;

        // DataTable
        this.tableData = this.page.locator('.cds--data-table-content');

        // Paginaion 
        this.paginationSelection = this.page.locator('.cds--select__page-number .cds--select-input');
        this.forwardcdsPage = this.page.locator('.cds--pagination__button--forward');
        this.backwardPage = this.page.locator('.cds--pagination__button--backward');

        // PerPage
        this.perPageItem = this.page.locator('.cds--select__item-count .cds--select-input');

        // PageMenu
        this.currentPage = this.page.locator('.shell-breadscrumb-container .cds--breadcrumb-item--current a');
        this.activityMenu = this.page.locator('.cds--header__menu-bar li a');

        // Version SideDrawar
        this.versionDrawer = this.page.locator('div.headers-drawer');
        this.closeVersionDrawer = this.page.locator('div.header-button-left-drawer');

        // Model
        this.modelHeading = this.page.locator('div.is-visible .cds--modal-header__heading');
        this.modelClose = this.page.locator('div.is-visible .cds--modal-close-button button');

        // RollOut Form
        this.rolloutName = this.page.locator('div.is-visible div.cds--text-input__field-wrapper [id="name"]')
        this.rolloutdes = this.page.locator('div.is-visible div.cds--text-area__wrapper [id="description"]')
        this.rolloutToName = this.page.locator('div.is-visible fieldset.cds--radio-button-group--label-right [for="internal_users"] span.cds--radio-button__appearance')
        this.rolloutSaveBtn = this.page.locator('div.is-visible div.cds--btn-set button.cds--btn--primary');        

        // Activity View and Edit
        this.activityViewBtn = this.page.locator('ul.cds--overflow-menu-options--open .activity-view-overflow-menu');
        this.activityEditBtn = this.page.locator('ul.cds--overflow-menu-options--open .activity-edit-overflow-menu');

    }
    // Verify the page Number
    async verifyPageNumber(pageNo) {

        // On Which page you are
        const pageSizeElement = await this.paginationSelection
        await expect(pageSizeElement).toHaveValue(pageNo);
    }

    // Paginations
    async pagination(pageNo) {

        const pageSizeElement = await this.paginationSelection;
        // Forward(Next) page
        const nextPage = String(Number(pageNo) + 1);
        await this.forwardcdsPage.click();
        await expect(pageSizeElement).toHaveValue(nextPage);

        // BackWard(Previous) page
        await this.backwardPage.click();
        await expect(pageSizeElement).toHaveValue(pageNo);
    }

    // Per Page Rows
    async perPageRows() {

        // ROW COUNT
        const defaultItemCount = await this.perPageItem;
        const countRow = await this.tableData.locator('tr').count();
        await expect(defaultItemCount).toHaveValue(String(countRow - 1));
    }

    // Find Activity Row By Current Status
    async activityRow(currentStatus) {

        await this.page.waitForTimeout(10);
        const row = await this.tableData.locator('tr');
        const countRow = await row.count();
        for (let i = 1; i < countRow; i++) {
            const cells = await row.nth(i).locator('td').nth(2).locator('span').innerText();
            if (cells === currentStatus) {
                return row.nth(i);
            }
        }
    }

    // Activity RollOut Button Enable
    async rolloutBtnEnable() {

        await this.page.waitForTimeout(10);
        const finalStatusRow = await this.activityRow("Final");
        const btn = await finalStatusRow.locator('td').nth(4).locator('.action-item-rollout')
        const btnName = await btn.innerText();
        expect(btnName).toContain('Rollout');
        expect(btn).toBeEnabled();

    }

    // Activity RollOut
    async activityRollout() {

        await this.page.waitForTimeout(10);
        const finalStatusRow = await this.activityRow("Final");
        const activityName = await finalStatusRow.locator('td').nth(0).locator('.information-text').innerText();
        const btn = await finalStatusRow.locator('td').nth(4).locator('.action-item-rollout')

        // RollOut Action
        await btn.click();
        const modal = await this.modelHeading;
        const text = await modal.innerText();
        await expect(text).toContain(activityName);
        //await this.modelClose.click();

    }

    async activityRolloutFillDetail() {
        
        await this.rolloutName.fill("Demo RollOut");
        await this.rolloutdes.fill('Demo RollOut Description');
        await this.rolloutToName.click();
        await this.rolloutSaveBtn.click();
        await this.modelClose.click();
    }

    // Activity Mark As Final Button Enable
    async markAsFinalBtnEnable() {

        await this.page.waitForTimeout(10);
        const drafStatusRow = await this.activityRow("Draft");
        const btn = await drafStatusRow.locator('td').nth(4).locator('.action-item-mark-as-final');
        const btnName = await btn.innerText();
        expect(btnName).toContain('Mark As Final');
        expect(btn).toBeEnabled();

    }

    // Activity Mark As Final
    async activityMarkAsFinal() {

        await this.page.waitForTimeout(10);
        const drafStatusRow = await this.activityRow("Draft");
        const btn = await drafStatusRow.locator('td').nth(4).locator('.action-item-mark-as-final');

        // Mark As Final Action
        await btn.click();
        const modal = await this.modelHeading;
        const text = await modal.innerText();
        await expect(text).toContain("Confirmation");
        await this.modelClose.click();
    }

    // Activity Restore Button Enable
    async restoreBtnEnable() {

        await this.page.waitForTimeout(10);
        const drafStatusRow = await this.activityRow("Delete");
        const btn = await drafStatusRow.locator('td').nth(4).locator('.action-item-restore');
        const btnName = await btn.innerText();
        expect(btnName).toContain('Restore');
        expect(btn).toBeEnabled();

    }

    // Activity Restore
    async activityRestore() {

        await this.page.waitForTimeout(10);
        const drafStatusRow = await this.activityRow("Delete");
        const btn = await drafStatusRow.locator('td').nth(4).locator('.action-item-restore');

        // Restore Button Action
        await btn.click();
    }

    // Back To Main Activity List Page
    async backToActivityPage(subMenu, menu) {

        await this.activityMenu.filter({ hasText: menu }).click();
        await this.page.locator('.cds--side-nav__item a .cds--side-nav__link-text').filter({ hasText: subMenu }).click();
        await this.page.locator('[data-testid="side-nav-toggle-button"]').click();
    }

    // Activity View From Ellipse
    async activityView() {

        await this.page.waitForTimeout(10);
        const drafRow = await this.activityRow("Draft");
        const btn = await drafRow.locator('td').nth(5).locator('.cds--overflow-menu__wrapper button');
        await btn.click();
        await this.activityViewBtn.click();

        const menuName = await this.currentPage.innerText();
        await expect(menuName).toContain("Workflow");
        await this.backToActivityPage("Definitions", "Activities");

    }

    // Activity Edit From Ellipse
    async activityEdit() {
        await this.page.waitForTimeout(10);
        const drafRow = await this.activityRow("Draft");
        const btn = await drafRow.locator('td').nth(5).locator('.cds--overflow-menu__wrapper button');
        await btn.click();
        await this.activityEditBtn.click();

        const menuName = await this.currentPage.innerText();
        await expect(menuName).toContain("Workflow");
        await this.backToActivityPage("Definitions", "Activities");
    }

    // Activity Version Drawer
    async activityVersionDrawer() {

        await this.page.waitForTimeout(10);
        const finalRow = await this.activityRow("Final");
        const activityName = await finalRow.locator('td').nth(0).locator('.information-text').innerText();
        await finalRow.locator('td').nth(3).locator('.cds--popover--high-contrast').click();
        const drawerHeader = await this.versionDrawer.locator('.header-button-right-drawer').innerText();
        await expect(drawerHeader).toContain(activityName);
        await this.closeVersionDrawer.click();
    }
}

export default ActicityList;