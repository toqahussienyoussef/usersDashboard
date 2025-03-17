<template>
  <component :is="layout">
    <router-view></router-view>
  </component>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useRoute } from "vue-router";
import DefaultLayout from "./layouts/DefaultLayout.vue";
import AuthLayout from "./layouts/AuthLayout.vue";

export default defineComponent({
  name: "App",
  components: {
    DefaultLayout,
    AuthLayout,
  },
  setup() {
    const route = useRoute();
    const layout = computed(() => {
      return route.meta.layout || "DefaultLayout";
    });
    return { layout };
  },
});
</script>
