// Types and Interfaces
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "manager" | "viewer";
  status: "active" | "inactive" | "suspended";
  dateJoined: string;
  lastLogin: string;
}

export interface Role {
  id: string;
  name: "admin" | "manager" | "viewer";
  permissions: string[];
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

// Utility functions
const generateRandomDelay = (min = 300, max = 800) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const simulateFailure = (failureRate = 0.1) => Math.random() < failureRate;

const ROLES: Role[] = [
  {
    id: "1",
    name: "admin",
    permissions: ["create", "read", "update", "delete"],
  },
  { id: "2", name: "manager", permissions: ["create", "read", "update"] },
  { id: "3", name: "viewer", permissions: ["read"] },
];

const initialUsers: User[] = [
  {
    id: "1",
    firstName: "Ahmed",
    lastName: "Tarek",
    email: "test.user@example.com",
    role: "admin",
    status: "active",
    dateJoined: "2023-01-01T00:00:00Z",
    lastLogin: "2023-10-01T10:00:00Z",
  },
  {
    id: "2",
    firstName: "Mohammed",
    lastName: "Othman",
    email: "mohammed.othman@example.com",
    role: "manager",
    status: "active",
    dateJoined: "2023-01-02T00:00:00Z",
    lastLogin: "2023-10-02T12:00:00Z",
  },
  {
    id: "3",
    firstName: "Khaled",
    lastName: "Ali",
    email: "khaled.ali@example.com",
    role: "viewer",
    status: "inactive",
    dateJoined: "2023-01-03T00:00:00Z",
    lastLogin: "2023-09-15T09:00:00Z",
  },
];

// Generate 75 initial users
for (let i = initialUsers.length + 1; i <= 75; i++) {
  initialUsers.push({
    id: `${i}`,
    firstName: `User${i}`,
    lastName: `Last${i}`,
    email: `user${i}@example.com`,
    role: ROLES[(i - 1) % ROLES.length].name,
    status: ["active", "inactive", "suspended"][(i - 1) % 3] as User["status"],
    dateJoined: `2023-${String(Math.floor((i - 1) / 31) + 1).padStart(
      2,
      "0"
    )}-${String(((i - 1) % 31) + 1).padStart(2, "0")}T00:00:00Z`,
    lastLogin: `2023-10-${String(((i - 1) % 31) + 1).padStart(
      2,
      "0"
    )}T10:00:00Z`,
  });
}

// Initialize mockUsers from localStorage or fallback to initialUsers
let mockUsers: User[] = (() => {
  const storedUsers = localStorage.getItem("mockUsers");
  return storedUsers ? JSON.parse(storedUsers) : [...initialUsers];
})();

export const mockApi = {
  resetUsers: () => {
    mockUsers = [...initialUsers];
    localStorage.setItem("mockUsers", JSON.stringify(mockUsers));
    console.log("Users reset to initial state:", mockUsers.length);
  },

  async getUsers(params: {
    page?: number;
    pageSize?: number;
    search?: string;
    role?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<PaginatedResponse<User>> {
    await new Promise((resolve) => setTimeout(resolve, generateRandomDelay()));
    if (simulateFailure()) throw new Error("Failed to fetch users");
    if (!Array.isArray(mockUsers)) {
      console.error("mockUsers corrupted, resetting:", mockUsers);
      mockUsers = [...initialUsers];
      localStorage.setItem("mockUsers", JSON.stringify(mockUsers));
    }
    let filteredUsers = [...mockUsers];
    if (params.search) {
      const searchTerm = params.search.toLowerCase();
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.firstName.toLowerCase().includes(searchTerm) ||
          user.lastName.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm)
      );
    }
    if (params.role)
      filteredUsers = filteredUsers.filter((user) => user.role === params.role);
    if (params.status)
      filteredUsers = filteredUsers.filter(
        (user) => user.status === params.status
      );
    if (params.sortBy) {
      filteredUsers.sort((a, b) => {
        const valueA = a[params.sortBy as keyof User];
        const valueB = b[params.sortBy as keyof User];
        const order = params.sortOrder === "desc" ? -1 : 1;
        if (typeof valueA === "string" && typeof valueB === "string") {
          return valueA.localeCompare(valueB) * order;
        }
        return (valueA > valueB ? 1 : -1) * order;
      });
    }
    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const startIndex = (page - 1) * pageSize;
    const paginatedUsers = filteredUsers.slice(
      startIndex,
      startIndex + pageSize
    );
    return {
      data: paginatedUsers || [],
      total: filteredUsers.length,
      page,
      pageSize,
    };
  },

  async getUser(id: string): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, generateRandomDelay()));
    if (simulateFailure()) throw new Error("Failed to fetch user");
    const user = mockUsers.find((u) => u.id === id);
    if (!user) throw new Error("User not found");
    return user;
  },

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, generateRandomDelay()));
    if (simulateFailure()) throw new Error("Failed to update user");
    const userIndex = mockUsers.findIndex((u) => u.id === id);
    if (userIndex === -1) throw new Error("User not found");
    mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates };
    localStorage.setItem("mockUsers", JSON.stringify(mockUsers)); // Persist changes
    return mockUsers[userIndex];
  },

  async createUser(userData: Omit<User, "id">): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, generateRandomDelay()));
    if (simulateFailure()) throw new Error("Network error occurred");

    // Check for duplicate email
    if (
      mockUsers.some(
        (u) => u.email.toLowerCase() === userData.email.toLowerCase()
      )
    ) {
      throw new Error("Email already exists");
    }

    // Basic validation
    if (!userData.email || !userData.firstName || !userData.lastName) {
      throw new Error("Missing required fields");
    }

    if (!["admin", "manager", "viewer"].includes(userData.role)) {
      throw new Error("Invalid role");
    }

    if (!["active", "inactive", "suspended"].includes(userData.status)) {
      throw new Error("Invalid status");
    }

    const maxId = Math.max(...mockUsers.map((u) => parseInt(u.id, 10)), 0);
    const newUser: User = {
      ...userData,
      id: `${maxId + 1}`,
      dateJoined: userData.dateJoined || new Date().toISOString(),
      lastLogin: userData.lastLogin || new Date().toISOString(),
    };
    mockUsers.push(newUser);
    localStorage.setItem("mockUsers", JSON.stringify(mockUsers));
    console.log("User created in mockApi:", newUser);
    return newUser;
  },

  async deleteUser(id: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, generateRandomDelay()));
    if (simulateFailure()) throw new Error("Failed to delete user");
    const userIndex = mockUsers.findIndex((u) => u.id === id);
    if (userIndex === -1) throw new Error("User not found");
    mockUsers.splice(userIndex, 1);
    localStorage.setItem("mockUsers", JSON.stringify(mockUsers));
  },

  async getRoles(): Promise<Role[]> {
    await new Promise((resolve) => setTimeout(resolve, generateRandomDelay()));
    if (simulateFailure()) throw new Error("Failed to fetch roles");
    return ROLES;
  },
};

type omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
