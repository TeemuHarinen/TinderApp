import cy from 'cypress'
const uri = "http://localhost:3000"
describe('Home', () => {
  beforeEach(() => {
    cy.visit('uri') // change this to the correct url of your app
  })

  it('should display the title', () => {
    cy.get('h1').contains('Swipe!')
  })

  it('should display the sign in button', () => {
    cy.get('.primary-button').contains('Create Account')
  })

  it('should open the modal when the sign in button is clicked', () => {
    cy.get('.primary-button').click()
    cy.get('.auth-modal') // replace this with the correct selector for your modal
  })
})