'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, X, Printer } from 'lucide-react';
import { FormTemplates } from './form-templates';
import { getClientForForm } from '@/server/actions/forms';
import type { ClientDetail } from '@/server/db/client';

interface RtoForm {
  id: string;
  title: string;
  description: string;
  formNumber: string;
  category: 'primary' | 'additional';
  requiredData: string[];
}

// Using ClientDetail type from the database
type ClientData = ClientDetail;

interface FormPreviewProps {
  form: RtoForm;
  clientId: string;
  onClose: () => void;
}

export function FormPreview({ form, clientId, onClose }: FormPreviewProps) {
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClientData = async () => {
      setLoading(true);
      try {
        const data = await getClientForForm(clientId);
        setClientData(data);
      } catch (error) {
        console.error('Failed to fetch client data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [clientId]);

  const handleDownload = () => {
    // TODO: Implement PDF generation and download
    console.log(`Downloading ${form.formNumber} for client ${clientId}`);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Loading...</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!clientData) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
          </DialogHeader>
          <div className="p-8 text-center">
            <p className="text-red-600">Failed to load client data</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="!max-w-none w-[98vw] h-[98vh] overflow-hidden p-0 !rounded-lg">
        <DialogHeader className="px-6 py-4 border-b bg-white sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DialogTitle>{form.title}</DialogTitle>
              <Badge variant="outline">{form.formNumber}</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button onClick={handlePrint} size="sm" variant="outline">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button onClick={handleDownload} size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button onClick={onClose} variant="outline" size="sm">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 bg-gray-100 p-8">
          <div className="mx-auto" style={{ width: '210mm', minHeight: '297mm' }}>
            <FormTemplates formId={form.id} clientData={clientData} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
