export function getApiErrorMessage(error, fallback = "Something went wrong") {
  if (error.response?.data?.message) return error.response.data.message;
  if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
    return "Cannot connect to API server. Start the backend or update VITE_API_URL in .env.";
  }
  return error.message || fallback;
}

export function isNetworkError(error) {
  return error.code === "ERR_NETWORK" || error.message === "Network Error";
}
