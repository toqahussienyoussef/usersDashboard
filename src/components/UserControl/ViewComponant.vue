<template>
  <v-dialog v-model="dialog" max-width="500">
    <template v-slot:activator="{ props: activatorProps }">
      <v-icon
        color="teal-lighten-2"
        v-bind="activatorProps"
        class="mr-2"
        @click="fetchUser"
      >
        mdi-eye
      </v-icon>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card title="View User Details">
        <v-card-text v-if="user">
          <v-list>
            <v-list-item>
              <v-list-item-title>ID:</v-list-item-title>
              <v-list-item-subtitle>
                <v-chip class="w-100 justify-center">
                  {{ user.id }}
                </v-chip>
              </v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>First Name:</v-list-item-title>
              <v-list-item-subtitle>
                <v-chip class="w-100 justify-center">
                  {{ user.firstName }}
                </v-chip>
              </v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Last Name:</v-list-item-title>
              <v-list-item-subtitle>
                <v-chip class="w-100 justify-center">
                  {{ user.lastName }}
                </v-chip>
              </v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Email:</v-list-item-title>
              <v-list-item-subtitle>
                <v-chip class="w-100 justify-center">
                  {{ user.email }}
                </v-chip>
              </v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Role:</v-list-item-title>
              <v-list-item-subtitle>
                <v-chip class="w-100 justify-center">
                  {{ formatRole(user.role) }}
                </v-chip>
              </v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Status:</v-list-item-title>
              <v-list-item-subtitle>
                <v-chip
                  class="w-100 justify-center"
                  :color="
                    {
                      active: 'green',
                      inactive: 'red',
                      suspended: 'grey',
                    }[user.status] || 'default'
                  "
                >
                  {{ user.status }}
                </v-chip>
              </v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Date Joined:</v-list-item-title>
              <v-list-item-subtitle>
                <v-chip class="w-100 justify-center">
                  {{ formatDate(user.dateJoined) }}
                </v-chip>
              </v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Last Login:</v-list-item-title>
              <v-list-item-subtitle>
                <v-chip class="w-100 justify-center">
                  {{ formatDate(user.lastLogin) }}
                </v-chip>
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-text v-else-if="usersStore.loading">Loading...</v-card-text>
        <v-card-text v-else-if="usersStore.error">{{
          usersStore.error
        }}</v-card-text>
        <v-card-text v-else>No user data available</v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            @click="isActive.value = false"
            class="w-100 bg-teal-lighten-2"
            >Close</v-btn
          >
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useUsersStore } from "../../stores/users";

export default defineComponent({
  name: "ViewComponent",
  props: {
    userId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const usersStore = useUsersStore();
    const dialog = ref(false);
    const user = ref<any>(null); // Store fetched user data

    // Fetch user data when icon is clicked
    const fetchUser = async () => {
      try {
        const fetchedUser = await usersStore.getUser(props.userId);
        user.value = fetchedUser;
        dialog.value = true; // Open dialog after fetching
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    // Format role for display
    const formatRole = (role: string) => {
      switch (role) {
        case "admin":
          return "Admin";
        case "manager":
          return "Manager";
        case "viewer":
          return "Viewer";
        default:
          return "Unknown Role";
      }
    };

    // Format date for better readability
    const formatDate = (isoDate: string) => {
      return new Date(isoDate).toLocaleString();
    };

    return {
      dialog,
      user,
      usersStore,
      fetchUser,
      formatRole,
      formatDate,
    };
  },
});
</script>

<style scoped>
.v-card-text {
  padding: 16px;
}
</style>
