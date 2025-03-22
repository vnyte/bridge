import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';

export default function Home() {
  return (
    <div>
      <Button size="lg">
        <PlusIcon /> New Admission
      </Button>
    </div>
  );
}
