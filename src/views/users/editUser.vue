<template>
  <main>
    <h2>Edit User #{{ $route.params.id }}</h2>
    <edit-componant
      :user-id="$route.params.id"
      @user-updated="handleUserUpdated"
    />
  </main>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { useAuthStore } from "../../stores/auth";
import { useUsersStore } from "../../stores/users";
import EditComponant from "../../components/UserControl/EditComponant.vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "EditUser",
  components: {
    EditComponant,
  },
  setup() {
    const authStore = useAuthStore();
    const usersStore = useUsersStore();
    const router = useRouter();

    // Ensure user is authenticated
    onMounted(() => {
      if (!authStore.isAuthenticated) {
        router.push("/login");
      }
    });

    const handleUserUpdated = () => {
      router.push("/"); // Redirect to UsersView after update
    };

    return {
      authStore,
      usersStore,
      handleUserUpdated,
    };
  },
});
</script>

<style scoped>
main {
  padding: 20px;
  max-width: 500px;
  margin: 0 auto;
}
</style>
