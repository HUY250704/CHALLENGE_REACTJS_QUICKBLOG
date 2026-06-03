import api from "@/components/services/api/client";
import { mockPostsApi } from "@/components/services/api/mockApi";

const useMockApi = import.meta.env.VITE_USE_MOCK_API === "true";

export const postsApi = {
  getAll: (params) => (useMockApi ? mockPostsApi.getAll(params) : api.get("/posts", { params }).then((res) => res.data)),
  getById: (id) => (useMockApi ? mockPostsApi.getById(id) : api.get(`/posts/${id}`).then((res) => res.data)),
  create: (payload) => (useMockApi ? mockPostsApi.create(payload) : api.post("/posts", payload).then((res) => res.data)),
  delete: (id) => (useMockApi ? mockPostsApi.delete(id) : api.delete(`/posts/${id}`).then((res) => res.data)),
};
