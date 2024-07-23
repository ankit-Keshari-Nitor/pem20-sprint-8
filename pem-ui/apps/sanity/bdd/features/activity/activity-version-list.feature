Feature: Activity List

  Background: 
    Given User navigates to the application
    When User navigates to "Definitions" of "Activities" [App-Nav]  
    Then Verify "Activity Definition" page is displayed [Page]["activities-list"]
    When User open version drawer by click of version history icon

  @current
  Scenario: Activity Version List page is loaded
    Then Verify activity version list default page "1" is displayed in [Page]["activities-version-list"]
    Then Verify activity version list pagination with default page "1" is displayed in [Page]["activities-list"]
    Then Verify activity version list perpage rows are displayed in [Page]["activities-list"]

  @current
  Scenario: Activity Version Rollout Button loaded
    Then Verify version current status is Final and Rollout Button is enable
    Then Verify version Rollout functionality

  @current  
  Scenario: Activity Version Mark as final Button loaded   
    Then Verify version current status is Draft and Mark as final Button is enable
    Then Verify version Mark as final functionality

  @current  
  Scenario: Activity Version Restore Button loaded
    Then Verify version current status is Delete and Restore Button is enable
    Then Verify version Restore functionality

  @current
  Scenario: Activity Version detail page is loaded in ReadOnly Mode
    Then Verify activities version list to view the activity in [Page]["activities-list"]

  @current
  Scenario: Activity Version detail page is loaded in Edit Mode  
    Then Verify activities version list to edit the activity in [Page]["activities-list"]