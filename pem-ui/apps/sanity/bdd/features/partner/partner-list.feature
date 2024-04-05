Feature: Partner List page

  Background: 
    Given User navigates to the application
    And User logs into the application as [SPONSOR_ADMIN] [Login]

  @current
  Scenario: As a SPONSOR_ADMIN I should be able to view partner list page
    Given User navigates to "Partners" under "Directories" [App-Nav]
    Then User verifies "Partners" page is displayed [Page]["partners"]
