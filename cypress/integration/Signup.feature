Feature: Forbid sign Up

  Scenario Outline: Forbid sign-ups if email already exists
    Given "<email>", "<password>", "<firstName>", "<lastName>", "<gender>"
    When I click sign up
    Then I should see the email-exists error
    Examples:
      | email              | password    | firstName | lastName | gender |
      | tforri0@google.com | Password!23 | Tor       | Forri    | male   |

  Scenario Outline: Forbid sign-ups for missing required fields
    Given "<email>", "<password>", "<firstName>", "<lastName>", "<gender>"
    When I click sign up
    Then I should see the "<errFields>" error message
    Examples:
      | email              | password     | firstName | lastName | gender | errFields                                    |
      |                    |              |           |          |        | email, password, firstName, lastName, gender |
      | edelynnm@gmail.com | Password123! | Edelynn   |          | female | lastName                                     |
      | edelynnm@gmail.com | Password123! | Edelynn   | Mallare  |        | gender                                       |

  Scenario Outline: Forbid sign-ups for weak passwords
    Given "<email>", "<password>", "<firstName>", "<lastName>", "<gender>"
    When I click sign up
    Then I see a password format error message
    Examples:
      | email              | password  | firstName | lastName | gender |
      | newUser@google.com | 12345pswd | John      | Doe      | female |
      | newUser@google.com | PAssW!    | John      | Doe      | female |

  Scenario Outline: Forbid invalid email formats
    Given "<email>", "<password>", "<firstName>", "<lastName>", "<gender>"
    When I click sign up
    Then I should see an invalid email format error
    Examples:
      | email        | password    | firstName | lastName | gender |
      | tforri0@.com | Password!23 | Tor       | Forri    | male   |