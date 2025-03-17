<template>
  <v-container class="pa-5 w-100">
    <h1>All Users</h1>
    <p>Welcome to the Users page, {{ authStore.user?.firstName }}!</p>

    <!-- Create User Button (Admin/Manager only) -->
    <v-btn
      v-if="authStore.hasRole('admin') || authStore.hasRole('manager')"
      color="teal-lighten-2"
      class="mt-4"
      to="/user/create"
    >
      Create User
    </v-btn>

    <!-- Filters Row -->
    <v-row class="mt-4">
      <v-col cols="12" sm="4">
        <v-text-field
          v-model="search"
          label="Search by name"
          prepend-inner-icon="mdi-magnify"
          clearable
          variant="outlined"
          @input="debouncedFetchUsers"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="4">
        <v-select
          v-model="selectedRole"
          :items="
            usersStore.roles.map((r) => ({ text: r.name, value: r.name }))
          "
          item-title="text"
          item-value="value"
          label="Filter by Role"
          clearable
          variant="outlined"
          @update:modelValue="debouncedFetchUsers"
        ></v-select>
      </v-col>
      <v-col cols="12" sm="4">
        <v-select
          v-model="selectedStatus"
          :items="usersStore.statuses.map((s) => ({ text: s, value: s }))"
          label="Filter by Status"
          item-title="text"
          item-value="value"
          clearable
          variant="outlined"
          @update:modelValue="debouncedFetchUsers"
        ></v-select>
      </v-col>
    </v-row>

    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="usersStore.users"
      :loading="usersStore.loading"
      :server-items-length="usersStore.total"
      :options.sync="tableOptions"
      @update:options="updateTableOptions"
      item-value="id"
      show-select
      class="mt-4"
    >
      <template v-slot:item.user="{ item }">
        <div>{{ `${item.firstName} ${item.lastName}` }}</div>
      </template>
      <template v-slot:item.role="{ item }">
        <div v-if="item.role === 'admin'">Admin</div>
        <div v-else-if="item.role === 'manager'">Manager</div>
        <div v-else-if="item.role === 'viewer'">Viewer</div>
      </template>
      <template v-slot:item.status="{ item }">
        <v-chip
          class="w-100 justify-center"
          :color="
            {
              active: 'green',
              inactive: 'red',
              suspended: 'grey',
            }[item.status] || 'default'
          "
        >
          {{ item.status }}
        </v-chip>
      </template>
      <template v-slot:item.actions="{ item }">
        <!-- View (All roles) -->
        <ViewComponant :userId="item.id" />
        <!-- Edit (Admin/Manager only) -->
        <router-link
          v-if="authStore.hasRole('admin') || authStore.hasRole('manager')"
          :to="`/user/edit/${item.id}`"
        >
          <v-icon color="teal-lighten-2" class="mr-2" @click="editUser(item)">
            mdi-pencil
          </v-icon>
        </router-link>
        <!-- Delete (Admin only) -->
        <DeleteComponent
          v-if="authStore.hasRole('admin')"
          :userId="item.id"
          @user-deleted="fetchUsers"
        />
      </template>
    </v-data-table>

    <v-alert v-if="usersStore.error" type="error" class="mt-4">
      {{ usersStore.error }}
    </v-alert>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useAuthStore } from "../../stores/auth";
import { useUsersStore } from "../../stores/users";
import DeleteComponent from "../../components/UserControl/DeleteComponent.vue";
import ViewComponant from "../../components/UserControl/ViewComponant.vue";
import debounce from "lodash/debounce";

export default defineComponent({
  name: "UsersView",
  components: {
    DeleteComponent,
    ViewComponant,
  },
  setup() {
    const authStore = useAuthStore();
    const usersStore = useUsersStore();
    const selected = ref<any[]>([]);
    const search = ref<string>("");
    const selectedRole = ref<string | null>(null);
    const selectedStatus = ref<string | null>(null);

    const tableOptions = ref({
      page: 1,
      itemsPerPage: 5,
      sortBy: [],
      sortDesc: [],
    });

    const headers = ref([
      { title: "ID", key: "id", align: "start" },
      { title: "User Name", key: "user", align: "center" },
      { title: "Email", key: "email", align: "center" },
      { title: "Role", key: "role", align: "center" },
      { title: "Status", key: "status", align: "center" },
      { title: "Date Joined", key: "dateJoined", align: "center" },
      { title: "Last Login", key: "lastLogin", align: "center" },
      {
        title: "Actions",
        key: "actions",
        align: "center",
        sortable: false,
        width: 200,
      },
    ]);

    const fetchUsers = async () => {
      const options: any = {
        page: tableOptions.value.page,
        pageSize: tableOptions.value.itemsPerPage,
        search: search.value || undefined,
        role: selectedRole.value || undefined,
        status: selectedStatus.value || undefined,
      };
      if (tableOptions.value.sortBy.length > 0) {
        options.sortBy = tableOptions.value.sortBy[0];
        options.sortOrder = tableOptions.value.sortDesc[0] ? "desc" : "asc";
      }
      await usersStore.fetchUsers(options);
    };

    const debouncedFetchUsers = debounce(() => {
      tableOptions.value.page = 1;
      fetchUsers();
    }, 300);

    const updateTableOptions = (options: any) => {
      tableOptions.value = options;
      fetchUsers();
    };

    const editUser = (user: any) => {
      console.log("Edit user:", user);
    };

    onMounted(async () => {
      await usersStore.fetchRoles();
      fetchUsers();
    });

    return {
      authStore,
      usersStore,
      selected,
      search,
      selectedRole,
      selectedStatus,
      headers,
      tableOptions,
      fetchUsers,
      editUser,
      updateTableOptions,
      debouncedFetchUsers,
    };
  },
});
</script>
