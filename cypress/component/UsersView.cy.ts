import { mount } from "@cypress/vue";
import UsersView from "../../src/views/users/index.vue";
import { useUsersStore } from "../../src/stores/users";
import { useAuthStore } from "../../src/stores/auth";
import { mockUsers } from "../support/mockApi";

describe("UsersView", () => {
  beforeEach(() => {
    const authStore = useAuthStore();
    authStore.user = {
      id: "1",
      email: "admin@example.com",
      role: "admin",
      firstName: "Admin",
    };
    const usersStore = useUsersStore();
    usersStore.users = mockUsers;
    usersStore.total = mockUsers.length;

    mount(UsersView, {
      global: {
        provide: {
          authStore,
          usersStore,
        },
      },
    });
  });

  it("renders user list", () => {
    cy.get("table").find("tr").should("have.length.greaterThan", 1);
    cy.contains("John Doe").should("be.visible");
    cy.contains("Jane Smith").should("be.visible");
  });

  it("shows delete button for admin", () => {
    cy.get("i.mdi-delete").should("have.length", mockUsers.length);
  });

  it("triggers delete confirmation", () => {
    cy.get("i.mdi-delete").first().click();
    cy.get(".v-dialog").should("be.visible");
    cy.contains("Confirm Delete").should("be.visible");
  });
});
