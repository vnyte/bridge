'use client';

import { Form1Template } from './form-1';
import { Form1ATemplate } from './form-1a';
import { Form2Template } from './form-2';
import { Form4Template } from './form-4';
import { Form5Template } from './form-5';
import { Form5BTemplate } from './form-5b';
import { Form8Template } from './form-8';
import { Form9Template } from './form-9';
import { FormLLDTemplate } from './form-lld';
import { Form4ATemplate } from './form-4a';

import type { ClientDetail } from '@/server/db/client';

type ClientData = ClientDetail;

interface FormTemplatesProps {
  formId: string;
  clientData: ClientData;
}

export function FormTemplates({ formId, clientData }: FormTemplatesProps) {
  const renderTemplate = () => {
    switch (formId) {
      case 'form-1':
        return <Form1Template clientData={clientData} />;
      case 'form-1a':
        return <Form1ATemplate clientData={clientData} />;
      case 'form-2':
        return <Form2Template clientData={clientData} />;
      case 'form-4':
        return <Form4Template clientData={clientData} />;
      case 'form-5':
        return <Form5Template clientData={clientData} />;
      case 'form-5b':
        return <Form5BTemplate clientData={clientData} />;
      case 'form-8':
        return <Form8Template clientData={clientData} />;
      case 'form-9':
        return <Form9Template clientData={clientData} />;
      case 'form-lld':
        return <FormLLDTemplate clientData={clientData} />;
      case 'form-4a':
        return <Form4ATemplate clientData={clientData} />;
      default:
        return (
          <div className="p-8 text-center">
            <p className="text-gray-500">Form template not found</p>
          </div>
        );
    }
  };

  return (
    <div
      className="bg-white shadow-lg print:shadow-none print:border-0 print-content"
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '20mm',
        margin: '0 auto',
        boxSizing: 'border-box',
        fontSize: '14px',
        lineHeight: '1.4',
      }}
    >
      {renderTemplate()}
    </div>
  );
}
