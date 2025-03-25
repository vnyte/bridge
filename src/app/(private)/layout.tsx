import { Sidebar } from '@/components/sidebar/sidebar';

export default async function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen bg-gray-50 p-6">
      <Sidebar />
      <main className="flex-1 overflow-auto px-6">
        <div className="bg-white rounded-xl h-full p-6">{children}</div>
      </main>
    </div>
  );
}
