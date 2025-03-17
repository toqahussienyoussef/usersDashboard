<!-- src/layouts/AuthLayout.vue -->
<template>
  <v-layout>
    <v-app>
      <v-main>
        <v-container fluid>
          <router-view></router-view>
        </v-container>
      </v-main>
    </v-app>
  </v-layout>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "AuthLayout",
  setup() {
    return {};
  },
});
</script>
