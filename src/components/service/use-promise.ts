import { ref } from "vue";

export const usePromise = () => {
  const loading = ref(false);
  const error = ref(false);

  return {
    wrap: (callback: () => Promise<any>) => {
      loading.value = true;
      error.value = false;

      return callback()
        .catch(() => (error.value = true))
        .finally(() => (loading.value = false));
    },

    loading,
    error,

    reset: () => {
      loading.value = false;
      error.value = false;
    },
  };
};
