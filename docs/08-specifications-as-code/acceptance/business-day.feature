Feature: Preserve the explicit business date

  @LB-008 @LB-009
  Scenario Outline: Resume an older open day
    Given the stored openDay is "2026-09-09"
    And loaded daily actions belong to "2026-09-09"
    When <event>
    Then the stored openDay and displayed date remain "2026-09-09"
    And the loaded daily actions remain associated with "2026-09-09"
    Examples:
      | event |
      | local midnight passes |
      | I refresh the application the next morning |
      | I reconnect after being offline |
      | I reopen the application after several skipped days |
      | the device clock or time zone changes |

  @LB-008
  Scenario: No open day has been initialized
    Given the user has no stored openDay
    When the screen loads
    Then it exposes the no-open-day state deliberately
    And it does not silently create or close a business day
    # Exact onboarding interaction remains OD-08.

  @LB-009 @future_writes
  Scenario: Reconnect a stale device with a different business day
    Given device A queued an action explicitly for "2026-09-09"
    And device B has advanced to "2026-09-10" under an approved close-day policy
    When device A reconnects
    Then its action is not silently relabeled as "2026-09-10"
    And it cannot silently overwrite the action for "2026-09-10"
    And any conflict is handled under the approved policy with an observable outcome
    # History representation and conflict policy remain OD-05.
