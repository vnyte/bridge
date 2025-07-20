'use client';

import type { ClientDetail } from '@/server/db/client';

interface Form9TemplateProps {
  clientData: ClientDetail;
}

export function Form9Template({ clientData }: Form9TemplateProps) {
  const formatName = (first?: string | null, middle?: string | null, last?: string | null) => {
    return [first, middle, last].filter(Boolean).join(' ');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="w-full h-full print:p-0">
      <div className="text-center mb-8">
        <h1 className="text-xl font-bold mb-2">FORM 9</h1>
        <h2 className="text-lg font-semibold mb-2">APPLICATION FOR DRIVING LICENCE RENEWAL</h2>
        <p className="text-sm">[See rule 17 of the Central Motor Vehicle Rules, 1989]</p>
      </div>

      <div className="mb-6">
        <h3 className="font-bold mb-4">APPLICANT INFORMATION:</h3>
        <table className="w-full border-collapse border border-black text-sm">
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50 w-1/3">Full Name</td>
            <td className="border border-black p-2">{formatName(clientData?.firstName, clientData?.middleName, clientData?.lastName)}</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Father&apos;s/Guardian&apos;s Name</td>
            <td className="border border-black p-2">{formatName(clientData?.guardianFirstName, clientData?.guardianMiddleName, clientData?.guardianLastName)}</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Date of Birth</td>
            <td className="border border-black p-2">{clientData?.birthDate ? formatDate(clientData.birthDate) : 'N/A'}</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Mobile Number</td>
            <td className="border border-black p-2">{clientData?.phoneNumber || 'N/A'}</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Present Address</td>
            <td className="border border-black p-2">{clientData?.address || 'N/A'}, {clientData?.city || 'N/A'}, {clientData?.state || 'N/A'} - {clientData?.pincode || 'N/A'}</td>
          </tr>
        </table>
      </div>

      <div className="mb-6">
        <h3 className="font-bold mb-4">EXISTING DRIVING LICENCE DETAILS:</h3>
        <table className="w-full border-collapse border border-black text-sm">
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Driving Licence Number</td>
            <td className="border border-black p-2">_________________________________________</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Date of Issue</td>
            <td className="border border-black p-2">_________________________________________</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Valid Till</td>
            <td className="border border-black p-2">_________________________________________</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Issuing Authority</td>
            <td className="border border-black p-2">_________________________________________</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Class of Vehicle Authorized</td>
            <td className="border border-black p-2">_________________________________________</td>
          </tr>
        </table>
      </div>

      <div className="mb-6">
        <h3 className="font-bold mb-4">RENEWAL DETAILS:</h3>
        <table className="w-full border-collapse border border-black text-sm">
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Renewal Period</td>
            <td className="border border-black p-2">☐ 20 years ☐ Till age 50 ☐ Other: _______</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Medical Certificate Required</td>
            <td className="border border-black p-2">☐ Yes ☐ No</td>
          </tr>
        </table>
      </div>

      <div className="mb-6">
        <h3 className="font-bold mb-4">DECLARATION:</h3>
        <div className="border border-black p-4 text-sm space-y-2">
          <p>I, <strong>{formatName(clientData?.firstName, clientData?.middleName, clientData?.lastName)}</strong>, hereby declare that:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>My driving licence has expired or is about to expire.</li>
            <li>I have not been convicted of any serious traffic offences.</li>
            <li>I am physically and mentally fit to drive.</li>
            <li>All information provided is true and correct.</li>
          </ul>
        </div>
      </div>

      <div className="flex justify-between items-end">
        <div>
          <p className="text-sm mb-2">Date: {formatDate(new Date().toISOString())}</p>
          <p className="text-sm">Place: ________________</p>
        </div>
        <div className="text-center">
          <div className="border-t border-black w-48 mb-2"></div>
          <p className="text-sm">Signature of Applicant</p>
        </div>
      </div>
    </div>
  );
}