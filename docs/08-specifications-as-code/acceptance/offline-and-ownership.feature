Feature: Reopen safely and preserve ownership

  @LB-010
  Scenario: Restart offline after loading
    Given an authenticated owner loaded the full hierarchy and explicit open day on a trusted device
    And the app shell and data were persistently cached
    When the app is closed and reopened without network connectivity
    Then the previously loaded owner hierarchy and unchanged day are available
    And category expansion still works
    And offline state does not falsely claim server acknowledgement

  @LB-010
  Scenario Outline: Required cached content is unavailable
    Given <condition>
    When I attempt offline access
    Then the available shell reports missing data or persistence limitations honestly
    And no invented hierarchy or open date is presented as stored personal data
    Examples:
      | condition |
      | the shell is cached but owner data was never loaded |
      | owner data has been evicted |
      | persistent data caching is unsupported |
    # A first-ever uncached visit requires connectivity; an unavailable shell cannot render a fallback.

  @LB-011 @future_writes
  Scenario Outline: A pending edit receives a server outcome
    Given an approved editing flow saves an offline change with an explicit business date
    When I reload before reconnecting
    Then the change remains locally saved and pending
    When I reconnect and the server <outcome>
    Then the UI <feedback>
    Examples:
      | outcome | feedback |
      | acknowledges the write | shows acknowledgement only after it is received |
      | rejects the write | surfaces an actionable failure without claiming synchronization |

  @LB-012
  Scenario: Enforce owner access in the emulator
    Given synthetic authenticated owners A and B with separate records
    When A reads A's authorized hierarchy
    Then the read succeeds
    When B or an unauthenticated caller attempts to read or modify A's records
    Then access is denied

  @LB-012
  Scenario: Do not bypass authentication through cached personal data
    Given A previously cached personal data on a device
    When A signs out and B or an unauthenticated session opens the app offline
    Then A's cached personal data is not exposed to that session
    # Provider, trusted-device, and cache-cleanup mechanisms remain OD-06 and OD-09.
