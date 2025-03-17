import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "users",
      component: () => import("../views/users/index.vue"),
      meta: {
        layout: "DefaultLayout",
        requiresAuth: true, // All roles need auth to view
        requiredRoles: ["admin", "manager", "viewer"],
      },
    },
    {
      path: "/user/create",
      name: "createUser",
      component: () => import("../views/users/createUser.vue"),
      meta: {
        layout: "DefaultLayout",
        requiresAuth: true,
        requiredRoles: ["admin", "manager"], // Only admin/manager can create
      },
    },
    {
      path: "/user/edit/:id",
      name: "editUser",
      component: () => import("../views/users/editUser.vue"),
      meta: {
        layout: "DefaultLayout",
        requiresAuth: true,
        requiredRoles: ["admin", "manager"], // Only admin/manager can edit
      },
    },
    {
      path: "/admin",
      name: "admin",
      component: () => import("../views/AdminPanelView.vue"),
      meta: {
        layout: "DefaultLayout",
        requiresAuth: true,
        requiredRoles: ["admin"],
      },
    },
    {
      path: "/roles",
      name: "roles",
      component: () => import("../views/users/userRoles.vue"),
      meta: {
        layout: "DefaultLayout",
        requiresAuth: true,
        requiredRoles: ["admin"], // Only admin can view roles
      },
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView.vue"),
      meta: { layout: "AuthLayout", requiresAuth: false },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.name === "login") {
    next();
    return;
  }

  if (authStore.isAuthenticated && authStore.isSessionExpired()) {
    console.log("Session expired, logging out...");
    authStore.logout();
    next({ name: "login", query: { redirect: to.fullPath, expired: "true" } });
    return;
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: "login", query: { redirect: to.fullPath } });
    return;
  }

  if (to.meta.requiredRoles && authStore.isAuthenticated) {
    const requiredRoles = to.meta.requiredRoles as string[];
    const userHasRole = requiredRoles.some((role) => authStore.hasRole(role));
    if (!userHasRole) {
      next({ name: "users" }); // Redirect to users if unauthorized
      return;
    }
  }

  next();
});

export default router;
