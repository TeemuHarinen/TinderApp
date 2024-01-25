
describe('Backend testing', () => {
  it('Default route works', () => {
    cy.request('http://localhost:3001')
      .should((response) => {
        expect(response.status).to.eq(200)
      })
  })
  
  it('User deletion route works', () => {
    cy.request('POST', 'http://localhost:3001/deleteUser', {
      email:'testregister123@gmail.com',
    }).should((response) => {
      expect(response.status).to.eq(201)
    })
  })

  it('User can register', () => {
    cy.request('POST', 'http://localhost:3001/register', {
      email: 'testregister123@gmail.com',
      password: 'testpassword'
    }).should((response) => {
      expect(response.status).to.eq(201)
    })
  })

  it('User can login', () => {
    cy.request('POST', 'http://localhost:3001/login', {
      email: 'testregister123@gmail.com',
      password: 'testpassword'
    }).should((response) => {
      expect(response.status).to.eq(201)
    })

    cy.request('POST', 'http://localhost:3001/deleteUser', {
      email: 'testuser@gmail.com'
    }).should((response) => {
      expect(response.status).to.eq(201)
    })
    cy.visit('http://localhost:3001')
  })
})

describe('Home page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
  })
  
  it('should display the title', () => {
    cy.get('h1').contains('Swipe!')
  })

  it('should display the sign in button', () => {
    cy.get('.primary-button').contains('Create Account')
  })

  it('should open the modal when the sign in button is clicked', () => {
    cy.get('.primary-button').click()
    cy.get('.auth-modal')
  })

  it('user can register', () => {
    cy.get('.primary-button').click()
    cy.get('.auth-modal')
    cy.get('input[name="email"]').type('testuser@gmail.com')
    cy.get('input[name="password"]').type('testpassword')
    cy.get('[data-cy="submit"]').click()
  })
})


describe('Welcome page', () => {
  beforeEach(() => {
    cy.request('POST', 'http://localhost:3001/deleteUser', {
      email: 'testuser@gmail.com'
    }).should((response) => {
      expect(response.status).to.eq(201)
    })
    cy.visit('http://localhost:3000')
    cy.get('.primary-button').click()
    cy.get('input[name="email"]').type('testuser@gmail.com')
    cy.get('input[name="password"]').type('testpassword')
    cy.get('[data-cy="submit"]').click()
    cy.request('POST', 'http://localhost:3001/deleteUser', {
      email: 'testuser@gmail.com'
    })
  })

  it('form submission works', () => {
    cy.wait(2000)
    cy.get('input[data-cy="first_name"]').type('Test')

    cy.get('input[data-cy="dob_day"]').type('01')
    cy.get('input[data-cy="dob_month"]').type('01')
    cy.get('input[data-cy="dob_year"]').type('2000')
    cy.get('input[data-cy="about"]').type('I am a test user')
    cy.get('input[data-cy="url"]').type('https://randomuser.me/api/portraits/men/2.jpg')
    cy.get('.primary-button').click()
    cy.get('.card-container').should('exist')
  })

})

