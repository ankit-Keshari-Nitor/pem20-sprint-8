Feature: Activity Definitions List

  Scenario: Validate Activity List page
    Given I'm logged into the PEM2.0 Applcaition with user "Automation1"
    When User navigates to "Definitions" of "Activities" [App-Nav]
    Then Verify "Activity Definition" page is displayed [Page]["activities-list"]
    Then Verify default page "1" is displayed in [Page]["activities-list"]
    Then Verify pagination with default page "1" is displayed in [Page]["activities-list"]
    Then Verify perpage rows are displayed in [Page]["activities-list"]



  Scenario: Validate Activity Mark as final functionality
    Then Verify activity current status is Draft and Mark as final Button is enable
    Then Verify Mark as final functionality
