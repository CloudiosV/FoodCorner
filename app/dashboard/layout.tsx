// app/dashboard/layout.tsx
export const metadata = {
    title: "POS",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-container">
      <main className="flex-1 p-4">
        {children}
      </main>
    </div>
  );
}