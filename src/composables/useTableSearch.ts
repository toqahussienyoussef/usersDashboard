import { ref, watch } from "vue";
import debounce from "lodash/debounce";
import { mockApi } from "../api/mockApi";

interface FetchOptions {
  search?: string;
  role?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export function useTableSearch() {
  const search = ref<string>("");
  const role = ref<string | null>(null);
  const status = ref<string | null>(null);
  const page = ref<number>(1);
  const pageSize = ref<number>(10);
  const items = ref<any[]>([]); // Use any[] to avoid TS complexity
  const total = ref<number>(0);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);

  const fetchItems = debounce(async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await mockApi.getUsers({
        search: search.value || undefined,
        role: role.value || undefined,
        status: status.value || undefined,
        page: page.value,
        pageSize: pageSize.value,
      });
      console.log("Fetched items:", response.data);
      items.value = response.data; // Directly assign the array
      total.value = response.total;
    } catch (err) {
      console.error("Fetch error:", err);
      error.value =
        err instanceof Error ? err.message : "Failed to fetch users";
      items.value = [];
      total.value = 0;
    } finally {
      loading.value = false;
    }
  }, 300);

  // Watch for changes and fetch
  watch(
    [search, role, status, page],
    () => {
      fetchItems();
    },
    { immediate: true }
  );

  const reset = () => {
    search.value = "";
    role.value = null;
    status.value = null;
    page.value = 1;
  };

  return {
    search,
    role,
    status,
    page,
    pageSize,
    items,
    total,
    loading,
    error,
    reset,
  };
}
