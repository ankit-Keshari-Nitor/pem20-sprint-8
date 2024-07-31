import { expect } from '@playwright/test';

class ActicityListPage {
    constructor(page) {
        this.page = page;

        // DataTable
        this.tableData = this.page.locator('.cds--data-table-content');

        // Paginaion 
        this.paginationSelection = this.page.locator('.cds--select__page-number .cds--select-input');
        this.nextPageButton = this.page.locator('.cds--pagination__button--forward');
        this.prevPageButton = this.page.locator('.cds--pagination__button--backward');

        // PerPage
        this.perPageItem = this.page.locator('.cds--select__item-count .cds--select-input');

        // PageMenu
        this.currentBreadCrumbItem = this.page.locator('.shell-breadscrumb-container .cds--breadcrumb-item--current a');
        this.activityMenu = this.page.locator('.cds--header__menu-bar li a');

        // Version SideDrawar
        this.versionDrawer = this.page.locator('div.headers-drawer');
        this.closeVersionDrawer = this.page.locator('div.header-button-left-drawer');

        // Modal
        this.modalHeading = this.page.locator('div.is-visible .cds--modal-header__heading');
        this.modalCloseButton = this.page.locator('div.is-visible .cds--modal-close-button button');

        // Ellipse options - View and Edit
        this.activityViewBtn = this.page.locator('ul.cds--overflow-menu-options--open .activity-view-overflow-menu');
        this.activityEditBtn = this.page.locator('ul.cds--overflow-menu-options--open .activity-edit-overflow-menu');

    }
    // Verify the page Number
    async verifyPageNumber(pageNo) {
        const pageSizeElement = await this.paginationSelection
        await expect(pageSizeElement).toHaveValue(pageNo);
    }

    // Paginations
    async pagination(pageNo) {
        const pageSizeElement = await this.paginationSelection;
        // Forward(Next) page
        const nextPage = String(Number(pageNo) + 1);
        await this.nextPageButton.click();
        await expect(pageSizeElement).toHaveValue(nextPage);

        // BackWard(Previous) page
        await this.prevPageButton.click();
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
   /* async activityRow(status,index,button) {
        await this.page.waitForTimeout(10);
        const row = await this.tableData.locator('tr');
        const countRow = await row.count();
        for (let i = 1; i < countRow; i++) {
            const cells = await row.nth(i).locator('td').nth(2).locator('span').innerText();
            if (cells === status) {
                return row.nth(i);
            }
        }
    }*/


     // Find Activity Row By Current Status
     async rowLevelElement(status,index,css) {
        await this.page.waitForTimeout(10);
        const row = await this.tableData.locator('tr');
        const countRow = await row.count();
        for (let i = 1; i < countRow; i++) {
            const cells = await row.nth(i).locator('td').nth(index).locator('span').innerText();
            if (cells === status) {
                return await row.nth(i).locator('td').nth(index).locator(css);
                
            }
        }
    }


    // Activity RollOut Button Enable
    async rolloutBtnEnable() {
        await this.page.waitForTimeout(10);
        const rollOutButton = await this.rowLevelElement("Final",4,".action-item-rollout");
        //const btn = await finalStatusRow.locator('td').nth(4).locator('.action-item-rollout')
        const btnName = await rollOutButton.innerText();
        expect(btnName).toContain('Rollout');
        expect(btn).toBeEnabled();
    }

    // Activity RollOut
    async activityRollout() {
        await this.page.waitForTimeout(10);
        //const finalStatusRow = await this.rowLevelElement("Final",0,".action-item-rollout");
        const activityName = await this.rowLevelElement("Final",0,".information-text");
        //await finalStatusRow.locator('td').nth(0).locator('.information-text').innerText();
        const btn = await this.rowLevelElement("Final",0,".action-item-rollout");
        // RollOut Action
        await btn.click();
        //const modal = await this.modalHeading;
        const text = await modalHeading.innerText();
        await expect(text).toContain(activityName);
        //await this.modelClose.click();
    }

/*    async activityRolloutFillDetail() {
        await this.rolloutName.fill("Demo RollOut");
        await this.rolloutdes.fill('Demo RollOut Description');
        await this.rolloutToName.click();
        await this.rolloutSaveBtn.click();
        await this.modelClose.click();
    }

    // Activity Mark As Final Button Enable
    async markAsFinalBtnEnable() {
        await this.page.waitForTimeout(10);
        //const drafStatusRow = await this.activityRow("Draft");
        const btn = await this.rowLevelElement("Draft",4,".action-item-mark-as-final");
        
        
        //await this.activityRow("Draft").locator('td').nth(4).locator('.action-item-mark-as-final');
        const btnName = await btn.innerText();
        expect(btnName).toContain('Mark As Final');
        expect(btn).toBeEnabled();
    }

    // Activity Mark As Final
    async activityMarkAsFinal() {
        await this.page.waitForTimeout(10);
        //const drafStatusRow = await this.activityRow("Draft");
        const btn = await this.rowLevelElement("Draft",4,".action-item-mark-as-final");
        
        // Mark As Final Action
        await btn.click();
        const modalHeading = await this.modalHeading.innerText();
        //const text = await modal.innerText();
        await expect(modalHeading).toContain("Confirmation");
        await this.modalCloseButton.click();
    }

    
    // Activity Restore Button Enable
    async restoreBtnEnable() {
        await this.page.waitForTimeout(10);
        //const drafStatusRow =;
        const btn =await this.rowLevelElement("Delete",4,".action-item-restore");
        
       // await  await this.activityRow("Delete").locator('td').nth(4).locator('.action-item-restore');
        const btnName = await btn.innerText();
        expect(btnName).toContain('Restore');
        expect(btn).toBeEnabled();
    }

    // Activity Restore
    async restoreAcitivity() {
        await this.page.waitForTimeout(10);
        //const drafStatusRow = 
        const btn =await this.rowLevelElement("Delete",4,".action-item-restore");
        // Restore Button Action
        await restoreButton.click();
    }
    /*

    // Back To Main Activity List Page
    async backToActivityPage(subMenu, menu) {
        await this.activityMenu.filter({ hasText: menu }).click();
        await this.page.locator('.cds--side-nav__item a .cds--side-nav__link-text').filter({ hasText: subMenu }).click();
        await this.page.locator('[data-testid="side-nav-toggle-button"]').click();
    }

    // Activity View From Ellipse
    async viewActivity() {
        await this.page.waitForTimeout(10);
        const drafRow = await this.activityRow("Draft");
        const btn = await drafRow.locator('td').nth(5).locator('.cds--overflow-menu__wrapper button');
        await btn.click();
        await this.activityViewBtn.click();
        const menuName = await this.currentBreadCrumbItem.innerText();
        await expect(menuName).toContain("Workflow");
        await this.backToActivityPage("Definitions", "Activities");
    }

    // Activity Edit From Ellipse
    async editActivity() {
        await this.page.waitForTimeout(10);
        const drafRow = await this.activityRow("Draft");
        const btn = await drafRow.locator('td').nth(5).locator('.cds--overflow-menu__wrapper button');
        await btn.click();
        await this.activityEditBtn.click();
        const menuName = await this.currentBreadCrumbItem.innerText();
        await expect(menuName).toContain("Workflow");
        await this.backToActivityPage("Definitions", "Activities");
    }

    // Activity Version Drawer
    async viewActivityVersions() {
        await this.page.waitForTimeout(10);
        const finalRow = await this.activityRow("Final");
        const activityName = await finalRow.locator('td').nth(0).locator('.information-text').innerText();
        await finalRow.locator('td').nth(3).locator('.cds--popover--high-contrast').click();
        const drawerHeader = await this.versionDrawer.locator('.header-button-right-drawer').innerText();
        await expect(drawerHeader).toContain(activityName);
        await this.closeVersionDrawer.click();
    }*/
}

module.exports = { ActicityListPage };