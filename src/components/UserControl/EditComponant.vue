<template>
  <main>
    <h2>Edit User</h2>
    <TextInputComponant
      v-model="firstName"
      type="text"
      label="First Name"
      :error-messages="fieldErrors.firstName"
    />
    <TextInputComponant
      v-model="lastName"
      type="text"
      label="Last Name"
      :error-messages="fieldErrors.lastName"
    />
    <TextInputComponant
      v-model="email"
      type="email"
      label="Email"
      :error-messages="fieldErrors.email"
    />
    <v-select
      v-model="status"
      :items="statusItems"
      label="Status"
      :error-messages="fieldErrors.status"
    ></v-select>
    <v-select
      v-model="role"
      :items="roleItems"
      item-title="name"
      item-value="name"
      label="Role"
      :error-messages="fieldErrors.role"
    ></v-select>
    <v-btn
      @click="submitForm"
      :loading="usersStore.loading"
      color="teal-lighten-2"
      >Save</v-btn
    >
    <v-alert v-if="formError" type="error" class="mt-4">{{
      formError
    }}</v-alert>
  </main>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import { useUsersStore } from "../../stores/users";
import { useRouter, useRoute } from "vue-router";
import TextInputComponant from "../../components/inputs/TextInputComponant.vue";
import { useErrorHandler } from "../../composables/useErrorHandler";

export default defineComponent({
  name: "EditComponant",
  components: {
    TextInputComponant,
  },
  setup() {
    const usersStore = useUsersStore();
    const router = useRouter();
    const route = useRoute();
    const { formError, fieldErrors, handleError, resetErrors } =
      useErrorHandler();

    const firstName = ref("");
    const lastName = ref("");
    const email = ref("");
    const status = ref<string | null>(null);
    const role = ref<string | null>(null);

    const statusItems = computed(() => usersStore.statuses);
    const roleItems = computed(() => usersStore.roles);

    onMounted(async () => {
      const userId = route.params.id as string;
      try {
        const user = await usersStore.getUser(userId);
        firstName.value = user.firstName;
        lastName.value = user.lastName;
        email.value = user.email;
        status.value = user.status;
        role.value = user.role;
      } catch (err) {
        handleError(err);
      }
    });

    const submitForm = async () => {
      resetErrors();

      if (!firstName.value)
        fieldErrors.value.firstName = "First name is required";
      if (!lastName.value) fieldErrors.value.lastName = "Last name is required";
      if (!email.value) fieldErrors.value.email = "Email is required";
      if (!status.value) fieldErrors.value.status = "Status is required";
      if (!role.value) fieldErrors.value.role = "Role is required";

      if (Object.values(fieldErrors.value).some((err) => err)) {
        formError.value = "Please fill in all required fields";
        return;
      }

      const updates = {
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        status: status.value as "active" | "inactive" | "suspended",
        role: role.value as "admin" | "manager" | "viewer",
      };

      try {
        await usersStore.updateUser(route.params.id as string, updates);
        router.push("/");
      } catch (err) {
        handleError(err);
      }
    };

    return {
      firstName,
      lastName,
      email,
      status,
      role,
      statusItems,
      roleItems,
      submitForm,
      usersStore,
      formError,
      fieldErrors,
    };
  },
});
</script>

<style scoped>
main {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 500px;
  margin: 0 auto;
}
</style>
