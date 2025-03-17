export const mockUsers = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    role: "admin",
    status: "active",
    dateJoined: "2023-01-01",
    lastLogin: "2023-10-01",
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane@example.com",
    role: "viewer",
    status: "inactive",
    dateJoined: "2023-02-01",
    lastLogin: "2023-09-01",
  },
];

export const mockApi = {
  getUsers: () =>
    Promise.resolve({
      data: mockUsers,
      total: mockUsers.length,
      page: 1,
      pageSize: 10,
    }),
  deleteUser: (id: string) => Promise.resolve(),
  createUser: (user: any) => Promise.resolve({ id: "3", ...user }),
  updateUser: (id: string, updates: any) => Promise.resolve({ id, ...updates }),
};
