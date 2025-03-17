import { setActivePinia, createPinia } from "pinia";
import { useUsersStore } from "../../src/stores/users";
import { mockApi } from "../support/mockApi";

describe("usersStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    // Mock API calls
    vi.spyOn(mockApi, "getUsers").mockResolvedValue({
      data: mockApi.mockUsers,
      total: 2,
      page: 1,
      pageSize: 10,
    });
    vi.spyOn(mockApi, "deleteUser").mockResolvedValue(undefined);
  });

  it("fetches users", () => {
    const store = useUsersStore();
    store.fetchUsers().then(() => {
      expect(store.users).to.have.length(2);
      expect(store.total).to.equal(2);
    });
  });

  it("deletes user with confirmation", () => {
    const store = useUsersStore();
    store.users = [...mockApi.mockUsers];
    store.deleteUser("1").then(() => {
      cy.get(".v-dialog").contains("Confirm Delete").should("be.visible");
      cy.get("button").contains("Confirm").click();
      expect(store.users).to.have.length(1);
    });
  });
});
