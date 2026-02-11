export default function DashboardCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="
        group relative rounded-2xl
        bg-[rgb(var(--card))]
        backdrop-blur-xl
        border border-[rgb(var(--border))]
        p-6 shadow-lg
        transition-all duration-300
        hover:shadow-2xl hover:-translate-y-1
      "
    >
      <h3 className="mb-3 text-sm font-semibold text-[rgb(var(--muted))]">
        {title}
      </h3>
      {children}
    </div>
  );
}
