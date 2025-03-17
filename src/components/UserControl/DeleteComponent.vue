<template>
  <v-dialog max-width="500">
    <template v-slot:activator="{ props: activatorProps }">
      <v-icon v-bind="activatorProps" color="red">mdi-delete</v-icon>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card title="Delete">
        <v-card-text>
          Are you sure you want to delete user with ID: {{ userId }}?
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text="Close" @click="isActive.value = false">Close</v-btn>
          <v-btn
            text="Delete"
            color="#D32F2F"
            :loading="loading"
            @click="deleteUser(isActive)"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useUsersStore } from "../../stores/users";

export default defineComponent({
  name: "DeleteComponent",
  props: {
    userId: {
      type: String,
      required: true,
    },
  },
  setup(props, { emit }) {
    const usersStore = useUsersStore();
    const loading = ref(false);

    const deleteUser = async (isActive: { value: boolean }) => {
      loading.value = true;
      try {
        await usersStore.deleteUser(props.userId);
        emit("user-deleted");
        isActive.value = false;
      } catch (error) {
        console.error("Failed to delete user:", error);
      } finally {
        loading.value = false;
      }
    };

    return {
      loading,
      deleteUser,
    };
  },
});
</script>
