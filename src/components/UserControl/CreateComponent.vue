<template>
  <main>
    <h2>Create Component</h2>
    <TextInputComponant
      v-model="firstName"
      type="text"
      label="First Name"
      hint="Ex, Ahmed"
      :error-messages="fieldErrors.firstName"
    />
    <TextInputComponant
      v-model="lastName"
      type="text"
      label="Last Name"
      hint="Ex, Khaled"
      :error-messages="fieldErrors.lastName"
    />
    <TextInputComponant
      v-model="email"
      type="email"
      label="Email"
      hint="e.g., ahmed.khaled@example.com"
      :error-messages="fieldErrors.email"
    />
    <v-select
      v-model="selectState"
      :items="statusItems"
      label="Status"
      hint="Select user status"
      persistent-hint
      variant="outlined"
      :error-messages="fieldErrors.status"
    ></v-select>
    <v-select
      v-model="selectRole"
      :items="roleItems"
      item-title="name"
      item-value="name"
      label="Role"
      hint="Select your role"
      persistent-hint
      variant="outlined"
      :error-messages="fieldErrors.role"
    ></v-select>
    <v-btn
      @click="submitForm"
      :loading="usersStore.loading"
      color="teal-lighten-2"
      >Submit</v-btn
    >
    <v-alert v-if="formError" type="error" class="mt-4">{{
      formError
    }}</v-alert>
  </main>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import TextInputComponant from "../../components/inputs/TextInputComponant.vue";
import { useUsersStore } from "../../stores/users";
import { useRouter } from "vue-router";
import { useErrorHandler } from "../../composables/useErrorHandler";
import { useAuthStore } from "../../stores/auth";

export default defineComponent({
  name: "CreateComponent",
  components: {
    TextInputComponant,
  },
  setup() {
    const usersStore = useUsersStore();
    const authStore = useAuthStore();
    const router = useRouter();

    const userErrorMap = {
      "Email already exists": {
        message: "This email is already in use",
        field: "email",
      },
      "Missing required fields": {
        message: "Please fill in all required fields",
      },
      "Invalid role": { message: "Please select a valid role", field: "role" },
      "Invalid status": {
        message: "Please select a valid status",
        field: "status",
      },
      "Network error occurred": {
        message: "A network error occurred, please try again",
      },
      "Failed to create user": {
        message: "Failed to create user, please try again",
      },
    };

    const { formError, fieldErrors, handleError, resetErrors } =
      useErrorHandler({
        errorMap: userErrorMap,
      });

    const firstName = ref("");
    const lastName = ref("");
    const email = ref("");
    const selectState = ref<string | null>(null);
    const selectRole = ref<string | null>(null);

    onMounted(() => {
      console.log("Mounted - Auth state:", {
        isAuthenticated: authStore.isAuthenticated,
      });
      usersStore.fetchRoles();
    });

    const statusItems = computed(() => usersStore.statuses);
    const roleItems = computed(() => usersStore.roles);

    const submitForm = async () => {
      resetErrors();
      console.log("Submitting user creation with:", {
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        status: selectState.value,
        role: selectRole.value,
      });

      if (!firstName.value)
        fieldErrors.value.firstName = "First name is required";
      if (!lastName.value) fieldErrors.value.lastName = "Last name is required";
      if (!email.value) fieldErrors.value.email = "Email is required";
      if (!selectState.value) fieldErrors.value.status = "Status is required";
      if (!selectRole.value) fieldErrors.value.role = "Role is required";

      if (Object.values(fieldErrors.value).some((err) => err)) {
        formError.value = "Please fill in all required fields";
        return;
      }

      const userData = {
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        status: selectState.value as "active" | "inactive" | "suspended",
        role: selectRole.value as "admin" | "manager" | "viewer",
        dateJoined: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };

      try {
        console.log("Creating user with data:", userData);
        await usersStore.createUser(userData);
        console.log("User created successfully");
        firstName.value = "";
        lastName.value = "";
        email.value = "";
        selectState.value = null;
        selectRole.value = null;
        router.push("/");
      } catch (err) {
        console.error("Create user error:", err);
        handleError(err);
      }
    };

    return {
      firstName,
      lastName,
      email,
      selectState,
      selectRole,
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
