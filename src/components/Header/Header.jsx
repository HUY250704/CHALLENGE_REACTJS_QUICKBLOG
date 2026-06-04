import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ClipboardList, LogOut, Moon, Plus, SquarePen, Sun, User, Users } from "lucide-react";
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
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-3 sm:h-24 sm:px-6">
        <Link to="/" className="flex items-center" aria-label="QuickBlog home">
          <img src={logo} alt="QuickBlog" className="h-10 w-auto sm:h-12" />
        </Link>

        <div className="flex items-center gap-2 sm:gap-5">
          <Button asChild className="h-8 rounded-md px-3 text-xs font-bold sm:h-9 sm:text-sm">
            <Link to="/create">
              <Plus className="h-4 w-4" />
              Create Blog
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-slate-950 hover:bg-transparent dark:text-slate-50 sm:h-11 sm:w-11"
            onClick={() => setDark((value) => !value)}
            aria-label="Toggle dark mode"
          >
            {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9 rounded-lg sm:h-11 sm:w-[3.25rem]" aria-label="Open user menu">
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
                    <MenuLink to="/create" icon={SquarePen} label="Create Blog" className="sm:hidden" />
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
                    <MenuLink to="/create" icon={SquarePen} label="Create Blog" className="sm:hidden" />
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
