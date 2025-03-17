import { mount } from "@cypress/vue";
import DefaultLayout from "../../src/layouts/DefaultLayout.vue";
import { useAuthStore } from "../../src/stores/auth";

describe("DefaultLayout", () => {
  beforeEach(() => {
    const authStore = useAuthStore();
    authStore.user = {
      id: "1",
      email: "admin@example.com",
      role: "admin",
      firstName: "Admin",
    };
    mount(DefaultLayout);
  });

  it("renders navigation", () => {
    cy.contains("Vue 3 App").should("be.visible");
    cy.contains("All Users").should("be.visible");
    cy.contains("Roles").should("be.visible");
  });
});
