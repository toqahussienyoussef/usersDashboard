<template>
  <v-card class="pa-6 mx-auto elevation-10 rounded-lg" style="max-width: 400px">
    <v-card-title class="text-h5 text-center primary--text font-weight-bold">
      Welcome Back
    </v-card-title>
    <v-card-subtitle class="text-center grey--text mt-2">
      Sign in to access your dashboard
      <v-chip class="d-flex my-2 align-center justify-center"
        >Email : test.user@example.com</v-chip
      >
      <v-chip class="d-flex my-2 align-center justify-center"
        >Password : password</v-chip
      >
    </v-card-subtitle>
    <v-card-text>
      <v-form ref="form" v-model="valid" @submit.prevent="submitForm">
        <TextInputComponant
          v-model="email"
          label="Email"
          type="email"
          hint="e.g., user@example.com"
          class="mb-4"
          :error-messages="fieldErrors.email"
        />

        <TextInputComponant
          v-model="password"
          :label="showPassword ? 'Password (visible)' : 'Password'"
          :type="showPassword ? 'text' : 'password'"
          hint="Minimum 8 characters, with a letter and number"
          :error-messages="fieldErrors.password"
        />

        <v-alert
          v-if="formError"
          type="error"
          dense
          class="mb-4"
          dismissible
          transition="scale-transition"
        >
          {{ formError }}
        </v-alert>
        <v-btn
          type="submit"
          color="teal-lighten-2"
          block
          large
          :loading="loading"
          :disabled="!valid || loading"
          class="mt-2 white--text font-weight-bold"
          elevation="2"
        >
          Sign In
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import TextInputComponant from "../components/inputs/TextInputComponant.vue";
import { useErrorHandler } from "../composables/useErrorHandler";

export default defineComponent({
  name: "LoginView",
  components: {
    TextInputComponant,
  },
  setup() {
    const email = ref("");
    const password = ref("");
    const loading = ref(false);
    const valid = ref(false);
    const showPassword = ref(false);
    const router = useRouter();
    const authStore = useAuthStore();
    const form = ref(null);

    // Define login-specific error mapping
    const loginErrorMap = {
      "Invalid credentials": { message: "Incorrect email or password" },
      "User not found": {
        message: "No account exists with this email",
        field: "email",
      },
      "Network error occurred": {
        message: "Unable to connect, please try again",
      },
      "Failed to login": { message: "Login failed, please try again" },
    };

    const { formError, fieldErrors, handleError, resetErrors } =
      useErrorHandler({
        errorMap: loginErrorMap,
        defaultMessage: "An unexpected error occurred during login",
      });

    // Custom password validation
    const validatePassword = (value: string) => {
      const errors = [];
      if (!value) errors.push("Password is required");
      if (value.length < 8)
        errors.push("Password must be at least 8 characters");
      if (!/[A-Za-z]/.test(value))
        errors.push("Password must contain a letter");

      return errors.length === 0 || errors.join(", ");
    };

    const submitForm = async () => {
      resetErrors();

      // Client-side validation
      if (!email.value) fieldErrors.value.email = "Email is required";
      const passwordValidation = validatePassword(password.value);
      if (passwordValidation !== true) {
        fieldErrors.value.password = passwordValidation;
      }

      const isValid = (form.value as any)?.validate();
      if (!isValid || Object.values(fieldErrors.value).some((err) => err)) {
        if (!formError.value) {
          formError.value = "Please correct the errors above";
        }
        return;
      }

      loading.value = true;
      try {
        const success = await authStore.login(email.value, password.value);
        if (success) {
          router.push({ name: "users" });
        }
      } catch (err) {
        handleError(err);
      } finally {
        loading.value = false;
      }
    };

    return {
      email,
      password,
      loading,
      valid,
      showPassword,
      authStore,
      form,
      submitForm,
      formError,
      fieldErrors,
    };
  },
});
</script>

<style scoped>
.rounded-lg {
  border-radius: 12px;
}

.primary--text {
  color: #4db6ac !important; /* Vuetify primary color */
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}
</style>
