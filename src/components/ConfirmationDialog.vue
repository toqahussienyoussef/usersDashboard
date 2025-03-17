<template>
  <v-dialog v-model="isVisible" max-width="400">
    <v-card>
      <v-card-title class="headline">{{ title }}</v-card-title>
      <v-card-text>{{ message }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" text @click="cancel">Cancel</v-btn>
        <v-btn color="red" text @click="confirm">Confirm</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ConfirmationDialog",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "Confirm Action",
    },
    message: {
      type: String,
      default: "Are you sure you want to proceed?",
    },
  },
  emits: ["confirm", "cancel"],
  computed: {
    isVisible: {
      get(): boolean {
        return this.visible;
      },
      set(value: boolean) {
        if (!value) this.cancel(); // Emit cancel when closed via overlay
      },
    },
  },
  methods: {
    confirm() {
      this.$emit("confirm");
    },
    cancel() {
      this.$emit("cancel");
    },
  },
});
</script>

<style scoped>
/* Optional custom styles */
</style>
