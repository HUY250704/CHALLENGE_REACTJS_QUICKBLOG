import { cn } from "@/lib/utils";

export function Table({ className, ...props }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className={cn("w-full min-w-[680px] text-left text-sm", className)} {...props} />
    </div>
  );
}

export function Th({ className, ...props }) {
  return (
    <th
      className={cn("border-b border-slate-200 px-4 py-4 text-xs font-bold uppercase tracking-wide dark:border-slate-800", className)}
      {...props}
    />
  );
}

export function Td({ className, ...props }) {
  return (
    <td
      className={cn("border-b border-slate-100 px-4 py-4 align-top dark:border-slate-800", className)}
      {...props}
    />
  );
}
