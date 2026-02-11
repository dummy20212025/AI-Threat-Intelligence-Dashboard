export default function ChartCard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="
        bg-white dark:bg-gray-900
        rounded-2xl
        shadow-md
        p-5
        h-[360px]
        flex flex-col
      "
    >
      {children}
    </div>
  );
}
