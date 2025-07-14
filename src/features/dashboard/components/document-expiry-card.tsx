'use client';

import { Card, CardContent, CardHeader, CardTitle, CardAction } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import Link from 'next/link';
import { VehicleDocumentExpiry } from '@/server/db/vehicle';
import { DocumentItem } from './document-item';
import { DocumentExpiryEmptyState } from './document-expiry-empty-state';

interface DocumentExpiryCardProps {
  documents: VehicleDocumentExpiry[];
}

const DOCUMENTS_TO_DISPLAY = 3;

export const DocumentExpiryCard = ({ documents }: DocumentExpiryCardProps) => {
  const displayedDocuments = documents.slice(0, DOCUMENTS_TO_DISPLAY);
  const hasMoreDocuments = documents.length > DOCUMENTS_TO_DISPLAY;
  const hasDocuments = documents.length > 0;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Document Expiry</CardTitle>
        <CardAction>
          <Button variant="ghost" size="icon" aria-label="Close card">
            <X className="h-4 w-4" />
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-6">
        {!hasDocuments ? (
          <DocumentExpiryEmptyState />
        ) : (
          <>
            <div className="space-y-6">
              {displayedDocuments.map((document, index) => (
                <DocumentItem
                  key={`${document.vehicleNumber}-${document.documentType}-${index}`}
                  document={document}
                />
              ))}
            </div>

            <Link href="/vehicles" className="block">
              <Button variant="outline" className="w-full">
                {hasMoreDocuments ? 'View All' : 'Manage Vehicles'}
              </Button>
            </Link>
          </>
        )}
      </CardContent>
    </Card>
  );
};
