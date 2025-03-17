<template>
  <v-app>
    <main>
      <CreateComponent />
    </main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import CreateComponent from "../../components/UserControl/CreateComponent.vue";

export default defineComponent({
  name: "createUser",
  components: {
    CreateComponent,
  },
});
</script>
