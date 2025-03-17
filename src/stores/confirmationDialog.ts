import { defineStore } from "pinia";
import { ref } from "vue";

export const useConfirmationDialog = defineStore("confirmationDialog", () => {
  const visible = ref<boolean>(false);
  const title = ref<string>("Confirm Action");
  const message = ref<string>("Are you sure you want to proceed?");
  const onConfirmCallback = ref<(() => void) | null>(null);

  const show = (options: {
    title?: string;
    message?: string;
    onConfirm: () => void;
  }) => {
    title.value = options.title || "Confirm Action";
    message.value = options.message || "Are you sure you want to proceed?";
    onConfirmCallback.value = options.onConfirm;
    visible.value = true;
    console.log("Confirmation dialog shown:", {
      title: title.value,
      message: message.value,
    });
  };

  const confirm = () => {
    if (onConfirmCallback.value) {
      onConfirmCallback.value();
    }
    hide();
  };

  const cancel = () => {
    hide();
  };

  const hide = () => {
    visible.value = false;
    onConfirmCallback.value = null;
    console.log("Confirmation dialog hidden");
  };

  return {
    visible,
    title,
    message,
    show,
    confirm,
    cancel,
  };
});
