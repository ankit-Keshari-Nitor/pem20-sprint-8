Feature: New Activity Definition 

  Background: 
    Given User navigates to the application
    When User navigates to "Definitions" of "Activities" [App-Nav]  
    And User verifies "Activity Definitions" page is displayed [Page]["activities-list"]
    When User clicks on "New" link in [Page]["activities-list"]
  
  @current
  Scenario: Activity List page is loaded
    Then User verifies "Workflow" is displayed as current breadscrumb on [Page]["new-activity"]
    Given User provides definition details to new activity
    Given User adds "partner" task to the new activities
    Given User save the new activity
    Then User verifies "Activity Definitions" page is displayed [Page]["activities-list"]


  