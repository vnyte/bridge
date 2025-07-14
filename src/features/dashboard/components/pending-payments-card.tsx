'use client';

import { Card, CardContent, CardHeader, CardTitle, CardAction } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import Link from 'next/link';

interface PendingPaymentsCardProps {
  pendingCount: number;
}

export const PendingPaymentsCard = ({ pendingCount }: PendingPaymentsCardProps) => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Overdue Payments</CardTitle>
        <CardAction>
          <Button variant="ghost" size="icon">
            <X className="h-4 w-4" />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="text-6xl font-bold text-orange-500">{pendingCount}</div>
          <div className="text-gray-600">Clients with Overdue Payments</div>
        </div>
        <Link href="/payments?paymentStatus=Overdue">
          <Button variant="outline" className="w-full">
            View List
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};
