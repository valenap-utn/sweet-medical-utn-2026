describe("Carrito de turnos", () => {
    it("permite a un paciente buscar un turno y agregarlo al carrito", () => {
        cy.visit("/login");
        cy.get('input[name="nombreUsuario"]').type("lisa");
        cy.get('input[name="password"]').type("Password_123");

        cy.contains("button", "Iniciar sesión").click();

        cy.url().should("include", "/turnos");

        cy.contains("Buscar turnos disponibles").should("be.visible");

        cy.get("select").first().select("ESPECIALIDAD");

        cy.get("select")
            .eq(1)
            .find("option")
            .should("have.length.greaterThan", 1);

        cy.get("select").eq(1).select(1);

        cy.contains("button", "Buscar").click();

        cy.get('[data-cy^="agregar-turno-"]')
            .first()
            .click();

        cy.get('[data-cy="contador-carrito"]')
            .should("contain", "1");

        cy.contains("Turno agregado a seleccionados.")
            .should("be.visible");

        cy.contains("Turno agregado a seleccionados.", {timeout: 8000})
            .should("not.exist");

        cy.get('[data-cy="abrir-carrito"]')
            .click();

        cy.contains("Mis turnos seleccionados").should("be.visible");

        cy.contains("Resumen").should("be.visible");
    });
});
