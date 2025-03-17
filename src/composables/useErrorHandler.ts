import { ref, Ref } from "vue";

interface FieldErrors {
  [key: string]: string;
}

interface ErrorMap {
  [key: string]: {
    message: string;
    field?: string; // Optional field to tie the error to (e.g., "email")
  };
}

interface ErrorHandlerOptions {
  errorMap?: ErrorMap;
  defaultMessage?: string;
}

interface ErrorHandlerResult {
  formError: Ref<string | null>;
  fieldErrors: Ref<FieldErrors>;
  handleError: (error: unknown, customMap?: ErrorMap) => void;
  resetErrors: () => void;
}

export function useErrorHandler(
  options: ErrorHandlerOptions = {}
): ErrorHandlerResult {
  const { errorMap = {}, defaultMessage = "An unexpected error occurred" } =
    options;

  const formError = ref<string | null>(null);
  const fieldErrors = ref<FieldErrors>({});

  const resetErrors = () => {
    formError.value = null;
    fieldErrors.value = {};
  };

  const handleError = (error: unknown, customMap: ErrorMap = {}) => {
    resetErrors();

    const combinedMap = { ...errorMap, ...customMap };
    const errorMessage = error instanceof Error ? error.message : String(error);

    const errorConfig = combinedMap[errorMessage];
    if (errorConfig) {
      if (errorConfig.field) {
        fieldErrors.value[errorConfig.field] = errorConfig.message;
      } else {
        formError.value = errorConfig.message;
      }
    } else {
      formError.value = defaultMessage;
    }
  };

  return {
    formError,
    fieldErrors,
    handleError,
    resetErrors,
  };
}
