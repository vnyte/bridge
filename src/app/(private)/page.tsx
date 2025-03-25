import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex justify-end items-center">
      <Button size="lg">
        <Link href="/admission" className="flex gap-2 items-center">
          <PlusIcon /> <p>New admission</p>
        </Link>
      </Button>
    </div>
  );
}
