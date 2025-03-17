import { defineStore } from "pinia";
import { ref } from "vue";
import { mockApi, User, Role } from "../api/mockApi";
import { useAuthStore } from "./auth";
import { useConfirmationDialog } from "./confirmationDialog";
interface FetchUsersOptions {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: string;
  status?: string;
  sortBy?: keyof User;
  sortOrder?: "asc" | "desc";
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export const useUsersStore = defineStore("users", () => {
  const authStore = useAuthStore();
  const confirmation = useConfirmationDialog();
  const users = ref<User[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const total = ref(0);
  const roles = ref<Role[]>([]);
  const statuses = ref<string[]>(["active", "inactive", "suspended"]);

  const fetchUsers = async (
    options: FetchUsersOptions = {}
  ): Promise<PaginatedResponse<User>> => {
    loading.value = true;
    error.value = null;
    try {
      const { page = 1, pageSize = 10, ...rest } = options;
      const response = await mockApi.getUsers({ page, pageSize, ...rest });
      users.value = response.data;
      total.value = response.total;
      return response;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to fetch users";
      return {
        data: [],
        total: 0,
        page: options.page || 1,
        pageSize: options.pageSize || 10,
      };
    } finally {
      loading.value = false;
    }
  };

  const fetchRoles = async () => {
    if (!authStore.hasRole("admin")) {
      error.value = "Unauthorized: Only admins can fetch roles";
      return;
    }
    loading.value = true;
    error.value = null;
    try {
      const fetchedRoles = await mockApi.getRoles();
      roles.value = fetchedRoles;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to fetch roles";
    } finally {
      loading.value = false;
    }
  };

  const getUser = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      const user = await mockApi.getUser(id);
      return user;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to fetch user";
    } finally {
      loading.value = false;
    }
  };

  const updateUser = async (id: string, updates: Partial<User>) => {
    if (!authStore.hasRole("admin") && !authStore.hasRole("manager")) {
      error.value = "Unauthorized: Only admin or manager can update users";
      return;
    }
    loading.value = true;
    error.value = null;
    try {
      const updatedUser = await mockApi.updateUser(id, updates);
      const index = users.value.findIndex((u) => u.id === id);
      if (index !== -1) {
        users.value[index] = updatedUser;
      }
      return updatedUser;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to update user";
    } finally {
      loading.value = false;
    }
  };

  const createUser = async (userData: Omit<User, "id">) => {
    if (!authStore.hasRole("admin") && !authStore.hasRole("manager")) {
      error.value = "Unauthorized: Only admin or manager can create users";
      throw new Error("Unauthorized");
    }
    loading.value = true;
    error.value = null;
    try {
      console.log("usersStore.createUser called with:", userData);
      const newUser = await mockApi.createUser(userData);
      users.value.push(newUser);
      total.value += 1;
      console.log("User created in store:", newUser);
      return newUser;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to create user";
      console.error("usersStore.createUser error:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteUser = async (id: string) => {
    if (!authStore.hasRole("admin")) {
      error.value = "Unauthorized: Only admin can delete users";
      return;
    }

    return new Promise<void>((resolve, reject) => {
      confirmation.show({
        title: "Confirm Delete",
        message:
          "Are you sure you want to delete this user? This action cannot be undone.",
        onConfirm: async () => {
          loading.value = true;
          error.value = null;
          try {
            await mockApi.deleteUser(id);
            users.value = users.value.filter((u) => u.id !== id);
            total.value -= 1;
            resolve();
          } catch (err) {
            error.value =
              err instanceof Error ? err.message : "Failed to delete user";
            reject(err);
          } finally {
            loading.value = false;
          }
        },
      });
    });
  };

  return {
    users,
    loading,
    error,
    total,
    roles,
    statuses,
    fetchUsers,
    fetchRoles,
    getUser,
    updateUser,
    createUser,
    deleteUser,
  };
});

type omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
