import api from "@/components/services/api/client";
import { mockAuthApi } from "@/components/services/api/mockApi";

const useMockApi = import.meta.env.VITE_USE_MOCK_API === "true";

export const authApi = {
  login: (payload) => (useMockApi ? mockAuthApi.login(payload) : api.post("/auth/login", payload).then((res) => res.data)),
  register: (payload) => (useMockApi ? mockAuthApi.register(payload) : api.post("/auth/register", payload).then((res) => res.data)),
  me: () => (useMockApi ? mockAuthApi.me() : api.get("/auth/me").then((res) => res.data)),
};
