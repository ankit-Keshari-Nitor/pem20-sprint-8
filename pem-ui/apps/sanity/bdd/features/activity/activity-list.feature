Feature: Activity List

  Background: 
    Given User navigates to the application
    When User navigates to "Definitions" of "Activities" [App-Nav]  

  # @current
  Scenario: Activity List page is loaded
    Then Verify "Activity Definition" page is displayed [Page]["activities-list"]
    Then Verify default page "1" is displayed in [Page]["activities-list"]
    Then Verify pagination with default page "1" is displayed in [Page]["activities-list"]
    Then Verify perpage rows are displayed in [Page]["activities-list"]

  # @current
  Scenario: Activity Rollout Button loaded
    Then Verify activity current status is Final and Rollout Button is enable
    Then Verify Rollout model
    When User Fill Rollout details for Internal Users

  # @current
  Scenario: Activity Mark as final Button loaded  
    Then Verify activity current status is Draft and Mark as final Button is enable
    Then Verify Mark as final functionality

  # @current
  Scenario: Activity Restore Button loaded
    Then Verify activity current status is Delete and Restore Button is enable
    Then Verify Restore functionality
  
  # @current
  Scenario: Activity detail page is loaded in ReadOnly Mode
    Then Verify activity details page is loaded in readonly mode on click of view button from ellipse menu in [Page]["activities-list"]

  # @current
  Scenario: Activity detail page is loaded in Edit Mode
    Then Verify activity details page is loaded on click of edit button from ellipse menu in [Page]["activities-list"]