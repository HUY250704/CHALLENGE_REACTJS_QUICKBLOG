import { useState } from "react";
import toast from "react-hot-toast";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import logo from "@/assets/logo-lGLL0Zb0.png";
import AuthShell from "@/components/AuthShell/AuthShell";
import { useAuth } from "@/components/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getApiErrorMessage } from "@/utils/apiError";

export default function SignUp() {
  const { register, isAuthenticated } = useAuth();
  const [form, setForm] = useState({ email: "", username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  if (isAuthenticated) return <Navigate to="/" replace />;

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await register(form);
      navigate(location.state?.from?.pathname || "/", { replace: true });
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Sign up failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
        <img src={logo} alt="QuickBlog" className="mx-auto mb-8 h-16" />
        <div className="space-y-4">
          <Input placeholder="Enter your email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Input placeholder="Enter your username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
          <Input placeholder="Enter your password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <Button className="w-full" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </Button>
        </div>
        <p className="mt-8 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-indigo-600">
            Login
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
