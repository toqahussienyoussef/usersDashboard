import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { mockApi, User } from "../api/mockApi";

// 1 hour in milliseconds
const SESSION_TIMEOUT = 60 * 60 * 1000; // 1 hour

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const isAuthenticated = ref(false);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const sessionStart = ref<number | null>(null); // Timestamp of login

  // Load session from localStorage on initialization
  const initializeSession = () => {
    const storedSession = localStorage.getItem("authSession");
    if (storedSession) {
      const { user: storedUser, timestamp } = JSON.parse(storedSession);
      const now = Date.now();
      if (now - timestamp < SESSION_TIMEOUT) {
        user.value = storedUser;
        isAuthenticated.value = true;
        sessionStart.value = timestamp;
        // console.log("Session restored:", { user: storedUser.email, timestamp });
      } else {
        console.log("Session expired on load, clearing...");
        logout();
      }
    }
  };

  const login = async (email: string, password: string) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await mockApi.getUsers({ page: 1, pageSize: 1000 });
      const foundUser = response.data.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );
      if (!foundUser) {
        throw new Error("User not found");
      }
      if (password !== "password") {
        throw new Error("Invalid credentials");
      }
      user.value = foundUser;
      isAuthenticated.value = true;
      sessionStart.value = Date.now(); // Set session start time
      // Persist session to localStorage
      localStorage.setItem(
        "authSession",
        JSON.stringify({ user: foundUser, timestamp: sessionStart.value })
      );
      console.log("Logged in:", {
        email,
        role: foundUser.role,
        sessionStart: sessionStart.value,
      });
      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to login";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    user.value = null;
    isAuthenticated.value = false;
    sessionStart.value = null;
    error.value = null;
    localStorage.removeItem("authSession"); // Clear session
    // console.log("Logged out:", { isAuthenticated: isAuthenticated.value });
  };

  const hasRole = (role: string): boolean => {
    if (!isAuthenticated.value || !user.value) return false;
    return user.value.role.toLowerCase() === role.toLowerCase();
  };

  // Check if session has expired
  const isSessionExpired = () => {
    if (!sessionStart.value) return true;
    const now = Date.now();
    const elapsed = now - sessionStart.value;
    return elapsed >= SESSION_TIMEOUT;
  };

  // Initialize session on store creation
  initializeSession();

  return {
    user,
    isAuthenticated,
    loading,
    error,
    sessionStart,
    login,
    logout,
    hasRole,
    isSessionExpired,
  };
});
