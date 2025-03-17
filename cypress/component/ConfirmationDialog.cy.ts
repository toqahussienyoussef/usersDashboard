import { mount } from "@cypress/vue";
import ConfirmationDialog from "../../src/components/ConfirmationDialog.vue";

describe("ConfirmationDialog", () => {
  it("renders and confirms", () => {
    let confirmed = false;
    mount(ConfirmationDialog, {
      props: {
        visible: true,
        title: "Test Delete",
        message: "Are you sure?",
      },
      listeners: {
        confirm: () => (confirmed = true),
      },
    });

    cy.contains("Test Delete").should("be.visible");
    cy.contains("Are you sure?").should("be.visible");
    cy.get("button").contains("Confirm").click();
    cy.wrap(confirmed).should("be.true");
  });

  it("cancels", () => {
    let canceled = false;
    mount(ConfirmationDialog, {
      props: { visible: true },
      listeners: {
        cancel: () => (canceled = true),
      },
    });

    cy.get("button").contains("Cancel").click();
    cy.wrap(canceled).should("be.true");
  });
});
