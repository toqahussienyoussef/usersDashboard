<template>
  <v-text-field
    :label="label"
    :hint="hint"
    :type="inputType"
    variant="outlined"
    :rules="applicableRules"
    v-model="model"
  ></v-text-field>
</template>

<script lang="ts">
import { defineComponent, computed, defineModel } from "vue";

export default defineComponent({
  name: "TextInputComponant",
  props: {
    type: {
      type: String,
      required: true,
      validator: (value: string) => ["text", "email"].includes(value),
    },
    label: {
      type: String,
      default: "Input",
    },
    hint: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    const model = defineModel<string>({ required: true });

    const rules = {
      required: (value: string) => !!value || "Required",
      email: (value: string) => {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !value || pattern.test(value) || "Invalid email";
      },
      text: (value: string) =>
        !value || value.length <= 50 || "Max 50 characters",
    };

    const applicableRules = computed(() => {
      if (props.type === "email") {
        return [rules.required, rules.email];
      }
      return [rules.required, rules.text];
    });

    const inputType = computed(() => props.type);

    return {
      model,
      applicableRules,
      inputType,
    };
  },
});
</script>
