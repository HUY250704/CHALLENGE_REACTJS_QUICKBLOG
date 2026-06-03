import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ClipboardList, LogOut, Moon, Sun, User, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "@/assets/logo-lGLL0Zb0.png";
import { useAuth } from "@/components/context/AuthContext";
import { Button } from "@/components/ui/button";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");
  const isAdmin = user?.role?.toLowerCase() === "admin";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <header className="sticky top-0 z-30 border-b border-transparent bg-white/90 backdrop-blur dark:bg-slate-950/90">
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center" aria-label="QuickBlog home">
          <img src={logo} alt="QuickBlog" className="h-12 w-auto" />
        </Link>

        <div className="flex items-center gap-3 sm:gap-5">
          <Button asChild className="hidden h-9 rounded-md px-3 text-sm sm:inline-flex">
            <Link to="/create">Create Blog</Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-11 w-11 text-slate-950 hover:bg-transparent dark:text-slate-50"
            onClick={() => setDark((value) => !value)}
            aria-label="Toggle dark mode"
          >
            {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button variant="outline" size="icon" className="h-11 w-[3.25rem] rounded-lg" aria-label="Open user menu">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="end"
                sideOffset={8}
                className="z-50 w-44 rounded-lg border border-slate-100 bg-white p-1.5 shadow-lg shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-900"
              >
                {isAuthenticated ? (
                  <>
                    <MenuLink to="/create" label="Create Blog" className="sm:hidden" />
                    <MenuLink to="/mypost" icon={ClipboardList} label="My Posts" />
                    {isAdmin && <MenuLink to="/admin" icon={Users} label="User Management" />}
                    <DropdownMenu.Item
                      onClick={logout}
                      className="flex h-9 cursor-pointer items-center gap-3 rounded-md px-2.5 text-sm font-normal text-slate-950 outline-none hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-800"
                    >
                      <LogOut className="h-3.5 w-3.5 shrink-0 text-slate-500 dark:text-slate-400" /> Logout
                    </DropdownMenu.Item>
                  </>
                ) : (
                  <>
                    <MenuLink to="/create" label="Create Blog" className="sm:hidden" />
                    <MenuLink to="/mypost" icon={ClipboardList} label="My Posts" />
                    <MenuLink to="/signup" icon={User} label="Sign Up" />
                  </>
                )}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>
    </header>
  );
}

function MenuLink({ to, icon: Icon, label, className = "" }) {
  return (
    <DropdownMenu.Item asChild>
      <NavLink
        to={to}
        className={`flex h-9 items-center gap-3 rounded-md px-2.5 text-sm font-normal text-slate-950 outline-none transition hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-800 ${className}`}
      >
        {Icon && <Icon className="h-3.5 w-3.5 shrink-0 text-slate-500 dark:text-slate-400" />}
        {label}
      </NavLink>
    </DropdownMenu.Item>
  );
}
