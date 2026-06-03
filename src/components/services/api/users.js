import api from "@/components/services/api/client";
import { mockUsersApi } from "@/components/services/api/mockApi";

const useMockApi = import.meta.env.VITE_USE_MOCK_API === "true";

export const usersApi = {
  getAll: () => (useMockApi ? mockUsersApi.getAll() : api.get("/users").then((res) => res.data)),
  delete: (id) => (useMockApi ? mockUsersApi.delete(id) : api.delete(`/users/${id}`).then((res) => res.data)),
  changeRole: (id, role) => (useMockApi ? mockUsersApi.changeRole(id, role) : api.put(`/users/${id}/role`, { role }).then((res) => res.data)),
};
