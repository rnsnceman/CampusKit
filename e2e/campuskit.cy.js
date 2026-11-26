describe("CampusKit student journey", () => {
  it("registers, filters equipment, creates and cancels a borrowing request", () => {
    const email = `campuskit-e2e-${Date.now()}@example.test`;
    const due = new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10);

    cy.visit("/");
    cy.contains("Explore the collection").should("be.visible");
    cy.contains("Canon EOS Rebel T7").should("be.visible");
    cy.contains("button", "Create an account").click();
    cy.get('input[name="name"]').type("CampusKit E2E Student");
    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type("DemoFlow2026!");
    cy.contains("button", "Create account").click();

    cy.contains("What will you create next?").should("be.visible");
    cy.contains("button", "Cameras").click();
    cy.contains("Canon EOS Rebel T7").should("be.visible");
    cy.contains("Audio-Technica AT2020").should("not.exist");
    cy.contains("Canon EOS Rebel T7").parents(".equipment-card").find("button").click();
    cy.get('input[type="date"]').type(due);
    cy.get("textarea").type("Testing the campus borrowing flow");
    cy.contains("button", "Send borrowing request").click();
    cy.contains("Request sent. Staff will review it shortly.").should("be.visible");
    cy.contains("button", "My borrowing").click();
    cy.contains("Pending review").should("be.visible");
    cy.contains("button", "Cancel").click();
    cy.contains("Cancelled").should("be.visible");
  });
});
