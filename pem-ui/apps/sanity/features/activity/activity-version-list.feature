Feature: Activity Versions Drawer

  Background:
    Given I'm logged into the PEM2.0 Applcaition with user "Automation1"
    When User navigates to "Definitions" of "Activities" [App-Nav]
    Then Verify "Activity Definition" page is displayed [Page]["activities-list"]
    When User open version drawer by click of version history icon


#   @current
  Scenario: Validate Activity Version Drawer
    Then Verify activity version list default page "1" is displayed in [Page]["activities-version-list"]
    Then Verify activity version list pagination with default page "1" is displayed in [Page]["activities-list"]
    Then Verify activity version list perpage rows are displayed in [Page]["activities-list"]


#   @current
  Scenario: Validate Rollout Functionality
    Then Verify version current status is Final and Rollout Button is enable
    Then Verify version Rollout functionality

#   @current
  Scenario: Validate Mark as Final Functionality
    Then Verify version current status is Draft and Mark as final Button is enable
    Then Verify version Mark as final functionality

#   @current
  Scenario: Validate Restore Activity Functionality
    Then Verify version current status is Delete and Restore Button is enable
    Then Verify version Restore functionality

#   @current
  Scenario: Validate user is able to see Activity details in view mode
    Then Verify activities version list to view the activity in [Page]["activities-list"]

#   @current
  Scenario: Validate user is able to see Activity detail page is edit mode
    Then Verify activities version list to edit the activity in [Page]["activities-list"]