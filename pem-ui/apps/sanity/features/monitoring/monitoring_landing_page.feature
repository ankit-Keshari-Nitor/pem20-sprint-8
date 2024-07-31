Feature: Activity Monitoring

    Background:
        Given I'm logged into the PEM2.0 Applcaition with user "Automation1"
        When User navigates to "Monitoring" of "Activities" [App-Nav]

    Scenario: Validate Activity Monitoring Landing page
        Then Verify "Activity Monitoring" page is displayed [Page]["activities-list"]
