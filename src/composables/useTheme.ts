import { ref, onMounted } from "vue";
import { useTheme } from "vuetify";

export function useThemeToggle() {
  const vuetifyTheme = useTheme();
  const currentTheme = ref<string>("light");

  // Load theme from localStorage on mount
  onMounted(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      currentTheme.value = savedTheme;
      vuetifyTheme.global.name.value = savedTheme;
    }
  });

  // Toggle theme
  const toggleTheme = () => {
    currentTheme.value = currentTheme.value === "light" ? "dark" : "light";
    vuetifyTheme.global.name.value = currentTheme.value;
    localStorage.setItem("theme", currentTheme.value);
    console.log("Theme switched to:", currentTheme.value);
  };

  return {
    currentTheme,
    toggleTheme,
  };
}
