'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Eye, Printer } from 'lucide-react';
import { ClientSelector } from './client-selector';
import { FormPreview } from './form-preview';

interface RtoForm {
  id: string;
  title: string;
  description: string;
  formNumber: string;
  category: 'primary' | 'additional';
  requiredData: string[];
}

const RTO_FORMS: RtoForm[] = [
  {
    id: 'form-1',
    title: 'Application-cum-Declaration: Physical Fitness',
    description: 'Used along with Form 2 when applying for a new learners licence',
    formNumber: 'Form 1',
    category: 'primary',
    requiredData: ['Personal Info', 'Medical Details', 'Guardian Info'],
  },
  {
    id: 'form-1a',
    title: 'Medical Certificate',
    description:
      'Required for applicants aged 40+, or those applying for commercial (transport) licences',
    formNumber: 'Form 1A',
    category: 'primary',
    requiredData: ['Personal Info', 'Medical Details', 'Age Verification'],
  },
  {
    id: 'form-2',
    title: 'Application for Learners Licence',
    description:
      'Covers new learners licence, permanent licence, addition of vehicle class, renewal, duplicate licence, and change/correction of DL',
    formNumber: 'Form 2',
    category: 'primary',
    requiredData: ['Personal Info', 'Address', 'Guardian Info', 'License Class'],
  },
  {
    id: 'form-4',
    title: 'Application for Permanent Driving Licence',
    description:
      'Submitted once the learners licence is held for 30 days; accompanied by documents, photos, etc.',
    formNumber: 'Form 4',
    category: 'primary',
    requiredData: ['Personal Info', 'Learning License', 'Address', 'Photos'],
  },
  {
    id: 'form-5',
    title: 'Driving School Certificate',
    description: 'Issued by certified driving schools, mandatory for transport licence applicants',
    formNumber: 'Form 5',
    category: 'primary',
    requiredData: ['Personal Info', 'School Details', 'Training Records'],
  },
  {
    id: 'form-8',
    title: 'Application for Adding a New Class of Vehicle',
    description: 'Used if you already hold a licence and want to add another vehicle category',
    formNumber: 'Form 8',
    category: 'additional',
    requiredData: ['Personal Info', 'Existing License', 'New Vehicle Class'],
  },
  {
    id: 'form-9',
    title: 'Application for Driving Licence Renewal',
    description: 'Submitted when renewing an existing DL — includes medical certificate as needed',
    formNumber: 'Form 9',
    category: 'additional',
    requiredData: ['Personal Info', 'Existing License', 'Medical Certificate'],
  },
  {
    id: 'form-lld',
    title: 'Application for Duplicate Driving Licence',
    description: 'For lost, damaged, or stolen licences; police FIR may also be required',
    formNumber: 'Form LLD',
    category: 'additional',
    requiredData: ['Personal Info', 'License Details', 'Police Report'],
  },
  {
    id: 'form-4a',
    title: 'Application for International Driving Permit (IDP)',
    description:
      'Required along with your valid DL, Medical Certificate, passport & visa copies, photos & applicable fees',
    formNumber: 'Form 4A',
    category: 'additional',
    requiredData: ['Personal Info', 'Driving License', 'Passport', 'Medical Certificate'],
  },
];

export function FormsPage() {
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [selectedForm, setSelectedForm] = useState<RtoForm | null>(null);
  const [activeTab, setActiveTab] = useState<'primary' | 'additional'>('primary');

  const filteredForms = RTO_FORMS.filter((form) => form.category === activeTab);

  const handlePreviewForm = (form: RtoForm) => {
    if (!selectedClient) {
      alert('Please select a client first');
      return;
    }
    setSelectedForm(form);
  };

  const handleDownloadForm = (form: RtoForm) => {
    if (!selectedClient) {
      alert('Please select a client first');
      return;
    }
    // TODO: Implement PDF generation and download
    console.log(`Downloading ${form.formNumber} for client ${selectedClient}`);
  };

  const handlePrintForm = (form: RtoForm) => {
    if (!selectedClient) {
      alert('Please select a client first');
      return;
    }
    // Open the form in preview mode and trigger print
    setSelectedForm(form);
    // Print will be triggered from the preview modal
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">RTO Forms</h1>
          <p className="text-muted-foreground">
            Generate pre-filled RTO forms using client data from onboarding
          </p>
        </div>

      <ClientSelector selectedClient={selectedClient} onClientSelect={setSelectedClient} />

      <div className="flex space-x-1 border-b">
        <button
          onClick={() => setActiveTab('primary')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'primary'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Primary Forms
        </button>
        <button
          onClick={() => setActiveTab('additional')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'additional'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Additional Forms
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredForms.map((form) => (
          <Card key={form.id} className="relative flex flex-col justify-between">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <Badge variant="outline">{form.formNumber}</Badge>
                </div>
              </div>
              <CardTitle className="text-lg">{form.title}</CardTitle>
              <CardDescription className="text-sm">{form.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Required Data:</h4>
                  <div className="flex flex-wrap gap-1">
                    {form.requiredData.map((data) => (
                      <Badge key={data} variant="secondary" className="text-xs">
                        {data}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handlePreviewForm(form)}
                    disabled={!selectedClient}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handlePrintForm(form)}
                    disabled={!selectedClient}
                  >
                    <Printer className="h-4 w-4 mr-1" />
                    Print
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleDownloadForm(form)}
                    disabled={!selectedClient}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedForm && selectedClient && (
        <FormPreview
          form={selectedForm}
          clientId={selectedClient}
          onClose={() => setSelectedForm(null)}
        />
      )}
      </div>
    </div>
  );
}
