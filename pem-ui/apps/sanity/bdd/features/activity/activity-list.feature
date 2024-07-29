Feature: Activity List

  Background: 
    Given User navigates to the application
    When User navigates to "Definitions" of "Activities" [App-Nav]  

  Scenario: Activity List page is loaded
    Then User verifies "Activity Definitions" page is displayed [Page]["activities-list"]

  