import { cn } from "@/lib/utils";

export function Badge({ className, variant = "default", ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        variant === "admin"
          ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200"
          : "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-200",
        className,
      )}
      {...props}
    />
  );
}
