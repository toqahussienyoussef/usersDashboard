<!-- src/views/AdminPanelView.vue -->
<template>
  <v-container>
    <v-row>
      <v-col>
        <h1>Admin Panel</h1>
        <p>This page is only accessible to Admins.</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "AdminPanelView",
  setup() {
    return {};
  },
});
</script>
