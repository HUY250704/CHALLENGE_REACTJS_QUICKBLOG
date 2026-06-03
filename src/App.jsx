import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "@/components/Layout/Layout";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import BlogDetails from "@/pages/BlogDetails/BlogDetails";
import CreateBlog from "@/pages/CreateBlog/CreateBlog";
import Home from "@/pages/Home/Home";
import Login from "@/pages/Login/Login";
import MyPost from "@/pages/MyPost/MyPost";
import SignUp from "@/pages/SignUp/SignUp";
import UserManagement from "@/pages/UserManagement/UserManagement";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/posts/:id" element={<BlogDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/create"
            element={
              <ProtectedRoute roles={["user", "admin"]}>
                <CreateBlog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mypost"
            element={
              <ProtectedRoute roles={["user", "admin"]}>
                <MyPost />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-posts"
            element={
              <ProtectedRoute roles={["user", "admin"]}>
                <MyPost />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["admin"]}>
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute roles={["admin"]}>
                <UserManagement />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
