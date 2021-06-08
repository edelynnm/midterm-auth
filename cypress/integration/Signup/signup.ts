import { Given, When, Then, Before } from "cypress-cucumber-preprocessor/steps";

const toUpperCase = (match: string, _: number, str: string) => {
  return (` ${match.toLowerCase()}`)
}

const titleCase = (fields: string[]) => fields.map((field) => field.replace(/(?=[A-Z])[A-Z]/g, toUpperCase))
  .map((converted) => converted.replace(/^[a-z]/, (match) => ` ${match.toUpperCase()}`))

Before(() => {
  cy.exec('npm run test-clearDB');
  cy.exec('npm run test-migration');
  cy.exec('npm run test-seed');
  cy.visit('/signup');
});

Given(`{string}, {string}, {string}, {string}, {string}`, (email, password, firstName, lastName, gender) => {
  const signUpDetails = [
    { testID: "[data-testid=email]", data: email },
    { testID: "[data-testid=password]", data: password },
    { testID: "[data-testid=firstName]", data: firstName },
    { testID: "[data-testid=lastName]", data: lastName },
  ];

  signUpDetails.forEach((field) => {
    if (field.data !== '') {
      cy.get(field.testID).type(field.data);
    }
  })

  if (gender !== '') {
    cy.get(`[data-testid=${gender.toLowerCase()}]`).click()
  }
})

When("I click sign up", () => {
  cy.get('[data-testid="signupBtn"]').click();
});

Then(`I should see the email-exists error`, () => {
  cy.get(`[data-testid=email-exists]`).should('be.visible')
});

Then(`I should see the {string} error message`, (fields) => {
  const errFields = fields.split(',' || ' ').map((name: string) => name.trim())

  const checkErr = (fields: string[], errTitles: string[]) => {
    fields.forEach((field: string, index: number) => {
      cy.get(`[data-testid=${field}]`).should('contain', `${errTitles[index]} is a required field`)
    });
  }

  if (errFields.length > 0) {
    const errTitles = titleCase(errFields).map((title) => title.trim())
    checkErr(errFields, errTitles)
  }
})

Then(`I see a password format error message`, () => {
  cy.get(`[data-testid=password]`).should('contain', `Password must contain an uppercase, a lowercase, a number, a symbol and must not be less than 8 characters.`)
})

Then(`I should see an invalid email format error`, () => {
  cy.get(`[data-testid=email]`).should('contain', `Email must be a valid email`)
})

// Given(`the following user details`, (dataTable) => {
//   dataTable.hashes().forEach((data: any) => {
//     for(let key in data) {
//       let value = data[key]
//       cy.log(key, value);

//       if (value !== '') {
//         if(key === 'gender') {
//           cy.get(`[data-testid=${value.toLowerCase()}]`).click()
//           break;
//         }

//         cy.get(`[data-testid=${key}]`).type(value);
//       }
//     }
//   });
// });

// Then('I should see following the required field error message', (dataTable) => {



//   dataTable.hashes().forEach((data: any) => {
//     for(let key in data) {
//       let value = data[key]
//       const errFields = value.split(',' || ' ').map((name:string) => name.trim())

//       if (errFields.length > 0) {
//         const errTitles = titleCase(errFields).map((title) => title.trim())
//         checkErr(errFields, errTitles)
//       }
//     }
//   });
// })