export function Spinner({ label = "Loading..." }) {
  return (
    <div className="flex min-h-60 items-center justify-center gap-3 text-slate-500 dark:text-slate-400">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
      <span>{label}</span>
    </div>
  );
}
