import { Button } from '@/components/ui/button';
import { OrganizationSwitcher } from '@clerk/nextjs';
import { SignOutButton } from '@clerk/nextjs';
import { LogOut } from 'lucide-react';
import { navItems } from './nav-items';
import { NavItem } from './nav-item';

export function Sidebar() {
  return (
    <div className="w-72 flex flex-col sticky top-0 max-h-screen transition-all duration-300 px-2 py-10 bg-white rounded-xl">
      <div className="flex flex-col flex-1 space-y-10">
        <OrganizationSwitcher hidePersonal />
        <div className="flex-1 flex flex-col gap-4">
          {navItems.map((item) => (
            <NavItem key={item.href} item={item} />
          ))}
        </div>
      </div>
      <div className="flex">
        <SignOutButton>
          <Button variant="ghost">
            <LogOut />
            Log out
          </Button>
        </SignOutButton>
      </div>
    </div>
  );
}
