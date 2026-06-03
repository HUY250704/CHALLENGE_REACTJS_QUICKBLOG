export default function AuthShell({ children }) {
  return (
    <main className="grid min-h-screen place-items-center bg-[linear-gradient(120deg,#070724_0%,#5947f0_48%,#05c7df_100%)] px-4 py-10">
      {children}
    </main>
  );
}
