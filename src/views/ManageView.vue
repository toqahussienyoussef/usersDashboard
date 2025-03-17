<!-- src/views/ManageView.vue -->
<template>
  <v-container>
    <v-row>
      <v-col>
        <h1>Manage</h1>
        <p>This page is accessible to Admins and Managers.</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ManageView",
  setup() {
    return {};
  },
});
</script>
