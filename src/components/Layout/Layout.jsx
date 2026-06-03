import { Outlet, useLocation } from "react-router-dom";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";

export default function Layout() {
  const { pathname } = useLocation();
  const authPage = pathname === "/login" || pathname === "/signup";

  if (authPage) return <Outlet />;

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-950 dark:bg-slate-950 dark:text-slate-50">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
