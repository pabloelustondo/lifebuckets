Feature: Scan and explore the life map

  @LB-001
  Scenario: Preserve the level-one taxonomy
    Given the taxonomy specification
    When the life map is displayed with every category expanded
    Then the 7 categories and 49 level-one luckets retain their specified codes, names, and order

  @LB-002
  Scenario: Expand categories independently
    Given all categories are collapsed
    When I expand Work and then Life
    Then both remain expanded and every other category remains visible
    When I collapse Work
    Then Life remains expanded

  @LB-003 @LB-004 @LB-005
  Scenario Outline: Read full-width rows without clipping
    Given a viewport width of <width> pixels and representative long names and details
    When I expand the categories
    Then rows use the same horizontal space without progressive indentation
    And codes and indicators stay visible while long text wraps without horizontal scrolling
    And each lucket orders its ID, condition square, action circle, name, and optional details
    And both font-sized shapes have thin black outlines
    Examples:
      | width |
      | 320   |
      | 1440  |

  @LB-006
  Scenario: Distinguish independent condition and action
    Given a synthetic lucket with different condition and action values
    When its row is displayed
    Then the square and circle retain their independent values
    And accessible labels distinguish condition from action
    And no unapproved final color meaning is invented

  @LB-002 @LB-006
  Scenario: Navigate without a pointer
    Given the category controls receive keyboard focus
    When I activate a category from the keyboard
    Then it toggles expansion with accurate aria-expanded and visible focus

  @LB-007
  Scenario: Keep the compact header
    Given an explicitly stored open date
    When the screen is displayed
    Then the header contains only LifeBuckets, avatar P, and that open date
    And there is no header legend, total summary, Open day label, or close-day control
