<template>
  <v-container class="pa-5">
    <h1>All Roles</h1>

    <!-- Search Field -->
    <v-text-field
      v-model="search"
      label="Search by role name"
      prepend-inner-icon="mdi-magnify"
      clearable
      class="mt-4 mb-4"
      @input="debouncedSearch"
      variant="outlined"
    ></v-text-field>

    <!-- Roles Table -->
    <v-data-table
      :headers="headers"
      :items="filteredRoles"
      :loading="usersStore.loading"
      item-value="id"
      class="elevation-1"
    >
      <template v-slot:item.permissions="{ item }">
        <v-chip
          v-for="(perm, index) in item.permissions"
          :key="index"
          small
          class="ma-1"
        >
          {{ perm }}
        </v-chip>
      </template>
    </v-data-table>

    <!-- Error Alert -->
    <v-alert v-if="usersStore.error" type="error" class="mt-4">
      {{ usersStore.error }}
    </v-alert>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import { useUsersStore } from "../../stores/users";

export default defineComponent({
  name: "RolesView",
  setup() {
    const usersStore = useUsersStore();
    const search = ref<string>("");

    // Table headers
    const headers = ref([
      { title: "ID", key: "id", align: "start" },
      { title: "Role Name", key: "name", align: "center" },
      {
        title: "Permissions",
        key: "permissions",
        align: "center",
        sortable: false,
      },
    ]);

    // Filter roles based on search
    const filteredRoles = computed(() => {
      const searchTerm = search.value ? search.value.toLowerCase() : "";
      return usersStore.roles.filter((role) =>
        role.name.toLowerCase().includes(searchTerm)
      );
    });

    // Fetch roles on mount
    onMounted(async () => {
      await usersStore.fetchRoles();
    });

    return {
      usersStore,
      search,
      headers,
      filteredRoles,
    };
  },
});
</script>
