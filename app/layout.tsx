import "./globals.css";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { Providers } from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        <Providers>
          <TopBar />
          <div className="flex h-[calc(100vh-64px)] gap-4">
            <Sidebar />
            <main className="flex-1 overflow-auto p-6">
              {children}
            </main>
          </div>

        </Providers>
      </body>
    </html>
  );
}


