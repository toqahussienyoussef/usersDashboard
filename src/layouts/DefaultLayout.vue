<template>
  <v-layout class="w-100">
    <!-- App Bar -->
    <v-app-bar app color="primary" dark density="compact">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>
        <router-link to="/" style="color: white; text-decoration: none">
          <h2>Vue 3 App</h2>
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <span v-if="authStore.user"
        >Welcome, {{ authStore.user.email }} ({{ authStore.user.role }})</span
      >
      <v-btn icon @click="toggleTheme" class="ml-4">
        <v-icon>{{
          currentTheme === "light"
            ? "mdi-moon-waxing-crescent"
            : "mdi-white-balance-sunny"
        }}</v-icon>
      </v-btn>
      <v-btn text @click="logout" class="ml-4">Logout</v-btn>
    </v-app-bar>

    <!-- Sidebar -->
    <v-navigation-drawer v-model="drawer" app>
      <v-sheet color="primary" class="pa-4">
        <router-link to="/" style="color: white; text-decoration: none">
          <h2>Vue 3 App</h2>
        </router-link>
      </v-sheet>
      <v-list>
        <v-list-item v-if="authStore.user">
          <v-list-item-title class="font-weight-bold">
            {{ `${authStore.user.firstName} ${authStore.user.lastName}` }}
            <ViewComponant :userId="authStore.user?.id" />
          </v-list-item-title>
          <v-list-item-subtitle>{{ authStore.user.role }}</v-list-item-subtitle>
        </v-list-item>
      </v-list>
      <v-list dense>
        <v-list-item to="/" prepend-icon="mdi-account-group" value="users">
          <v-list-item-title>All Users</v-list-item-title>
        </v-list-item>
        <v-list-item
          v-if="authStore.hasRole('admin')"
          to="/roles"
          prepend-icon="mdi-shield-account"
          value="roles"
        >
          <v-list-item-title>Roles</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main class="mt-9">
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>

    <!-- User Dialog -->
    <!-- <v-dialog v-model="showUserDialog" max-width="400">
      <v-card>
        <v-card-title class="headline">User Details</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <strong>Name:</strong>
              {{ `${authStore.user?.firstName} ${authStore.user?.lastName}` }}
            </v-col>
            <v-col cols="12">
              <strong>Email:</strong> {{ authStore.user?.email }}
            </v-col>
            <v-col cols="12">
              <ViewComponant :userId="authStore.user?.id" />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="showUserDialog = false"
            >Close</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog> -->
    <!-- Confirmation Dialog -->
    <ConfirmationDialog
      :visible="confirmation.visible"
      :title="confirmation.title"
      :message="confirmation.message"
      @confirm="confirmation.confirm"
      @cancel="confirmation.cancel"
    />
  </v-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { useThemeToggle } from "../composables/useTheme";
import { useConfirmationDialog } from "../stores/confirmationDialog";
import ViewComponant from "../components/UserControl/ViewComponant.vue";
import ConfirmationDialog from "../components/ConfirmationDialog.vue";

export default defineComponent({
  name: "DefaultLayout",
  components: {
    ViewComponant,
    ConfirmationDialog,
  },
  setup() {
    const drawer = ref(true);
    const router = useRouter();
    const authStore = useAuthStore();
    const { currentTheme, toggleTheme } = useThemeToggle();
    const confirmation = useConfirmationDialog();
    const logout = () => {
      authStore.logout();
      router.push({ name: "login" });
    };

    return {
      drawer,
      authStore,
      logout,
      currentTheme,
      toggleTheme,
      confirmation,
    };
  },
});
</script>

<style scoped>
.v-main {
  padding-left: 256px;
}
@media (max-width: 959px) {
  .v-main {
    padding-left: 0;
  }
}
</style>
