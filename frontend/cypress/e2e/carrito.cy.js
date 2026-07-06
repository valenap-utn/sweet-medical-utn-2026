describe("Carrito de turnos", () => {
    it("permite a un paciente buscar un turno, agregarlo al carrito y ver el resumen", () => {
        cy.intercept("POST", "**/api/auth/login").as("login");
        cy.intercept("GET", "**/api/turnos/disponibles*").as("buscarTurnos");

        cy.visit("/login");

        cy.get('input[name="nombreUsuario"]').type("lisa");
        cy.get('input[name="password"]').type("Password_123");

        cy.contains("button", "Iniciar sesión").click();

        cy.wait("@login");

        cy.contains(".patient-action-card", "Buscar turnos")
            .click();

        cy.url().should("include", "/turnos");
        cy.contains("Buscar turnos disponibles").should("be.visible");

        cy.get("select").first().select("ESPECIALIDAD");

        cy.get("select")
            .eq(1)
            .find("option")
            .should("have.length.greaterThan", 1);

        cy.get("select").eq(1).select(1);

        cy.contains("button", "Buscar")
            .should("not.be.disabled")
            .click();

        cy.wait("@buscarTurnos");

        cy.get('[data-cy^="agregar-turno-"]', { timeout: 10000 })
            .should("have.length.greaterThan", 0)
            .first()
            .click();

        cy.contains("Turno agregado a seleccionados.")
            .should("be.visible");

        cy.visit("/carrito");

        cy.contains("Mis turnos seleccionados").should("be.visible");
        cy.contains("Resumen").should("be.visible");
        cy.contains("Total estimado").should("be.visible");
        cy.contains("Confirmar turnos").should("be.visible");
    });
});