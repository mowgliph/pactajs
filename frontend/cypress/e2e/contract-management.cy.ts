describe('Contract Management E2E', () => {
  beforeEach(() => {
    cy.visit('/');
    // Assume login is handled or mock it
  });

  it('should load the dashboard', () => {
    cy.contains('Dashboard').should('be.visible');
  });

  it('should create a new contract', () => {
    cy.get('[data-cy=create-contract]').click();
    cy.get('[data-cy=contract-title]').type('Test Contract');
    cy.get('[data-cy=contract-parties]').type('Party A, Party B');
    cy.get('[data-cy=contract-submit]').click();
    cy.contains('Test Contract').should('be.visible');
  });

  it('should view contract details', () => {
    cy.get('[data-cy=contract-list]').contains('Test Contract').click();
    cy.contains('Contract Details').should('be.visible');
  });

  it('should add a supplement', () => {
    cy.get('[data-cy=contract-list]').contains('Test Contract').click();
    cy.get('[data-cy=add-supplement]').click();
    cy.get('[data-cy=supplement-reason]').type('Price Update');
    cy.get('[data-cy=supplement-submit]').click();
    cy.contains('Supplement added').should('be.visible');
  });
});