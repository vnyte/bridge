import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { OrganizationSwitcher } from '@clerk/nextjs';

const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Customers', href: '/customers' },
  { label: 'Payments', href: '/payments' },
  { label: 'Calendar', href: '/calendar' },
  { label: 'Vehicles', href: '/vehicles' },
  { label: 'Staff', href: '/staff' },
] as const;

function NavItem({ item }: { item: (typeof navItems)[number] }) {
  return (
    <Link href={item.href} className="block">
      <Button
        variant="ghost"
        className="w-full h-full min-h-[40px] py-4 px-2 cursor-pointer justify-start"
      >
        <span className="text-base font-medium text-gray-600">{item.label}</span>
      </Button>
    </Link>
  );
}

export function Sidebar() {
  return (
    <div className="w-56 flex flex-col sticky top-0 max-h-screen transition-all duration-300 px-2 py-10 bg-white rounded-xl">
      <div className="flex flex-col flex-1 space-y-10">
        <OrganizationSwitcher hidePersonal />
        <div className="flex-1 flex flex-col gap-4">
          {navItems.map((item) => (
            <NavItem key={item.href} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
