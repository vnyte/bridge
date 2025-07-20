'use client';

import type { ClientDetail } from '@/server/db/client';

interface Form4ATemplateProps {
  clientData: ClientDetail;
}

export function Form4ATemplate({ clientData }: Form4ATemplateProps) {
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
        <h1 className="text-xl font-bold mb-2">FORM 4A</h1>
        <h2 className="text-lg font-semibold mb-2">APPLICATION FOR INTERNATIONAL DRIVING PERMIT (IDP)</h2>
        <p className="text-sm">[See rule 15A of the Central Motor Vehicle Rules, 1989]</p>
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
            <td className="border border-black p-2 font-medium bg-gray-50">Nationality</td>
            <td className="border border-black p-2">Indian</td>
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
        <h3 className="font-bold mb-4">INDIAN DRIVING LICENCE DETAILS:</h3>
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
        <h3 className="font-bold mb-4">PASSPORT DETAILS:</h3>
        <table className="w-full border-collapse border border-black text-sm">
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Passport Number</td>
            <td className="border border-black p-2">_________________________________________</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Date of Issue</td>
            <td className="border border-black p-2">_________________________________________</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Date of Expiry</td>
            <td className="border border-black p-2">_________________________________________</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Place of Issue</td>
            <td className="border border-black p-2">_________________________________________</td>
          </tr>
        </table>
      </div>

      <div className="mb-6">
        <h3 className="font-bold mb-4">TRAVEL DETAILS:</h3>
        <table className="w-full border-collapse border border-black text-sm">
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Purpose of Travel</td>
            <td className="border border-black p-2">
              <div className="space-y-1">
                <div>☐ Tourism</div>
                <div>☐ Business</div>
                <div>☐ Employment</div>
                <div>☐ Study</div>
                <div>☐ Other: _____________________</div>
              </div>
            </td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Countries to Visit</td>
            <td className="border border-black p-2">_________________________________________</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Expected Duration of Stay</td>
            <td className="border border-black p-2">_________________________________________</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Tentative Date of Departure</td>
            <td className="border border-black p-2">_________________________________________</td>
          </tr>
        </table>
      </div>

      <div className="mb-6">
        <h3 className="font-bold mb-4">VISA DETAILS (if applicable):</h3>
        <table className="w-full border-collapse border border-black text-sm">
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Visa Number</td>
            <td className="border border-black p-2">_________________________________________</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Visa Type</td>
            <td className="border border-black p-2">_________________________________________</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Valid From</td>
            <td className="border border-black p-2">_________________________________________</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Valid Till</td>
            <td className="border border-black p-2">_________________________________________</td>
          </tr>
        </table>
      </div>

      <div className="mb-6">
        <h3 className="font-bold mb-4">DOCUMENTS SUBMITTED:</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>☐ Duly filled Application Form 4A</div>
          <div>☐ Original Indian Driving Licence</div>
          <div>☐ Copy of Passport (all pages)</div>
          <div>☐ Copy of Visa (if applicable)</div>
          <div>☐ Medical Certificate Form 1A</div>
          <div>☐ Passport size photographs</div>
          <div>☐ Fee receipt</div>
          <div>☐ Other: _____________________</div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-bold mb-4">DECLARATION:</h3>
        <div className="border border-black p-4 text-sm space-y-2">
          <p>I, <strong>{formatName(clientData?.firstName, clientData?.middleName, clientData?.lastName)}</strong>, hereby declare that:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>I hold a valid Indian driving licence as mentioned above.</li>
            <li>I understand that the IDP is valid only in conjunction with my Indian driving licence.</li>
            <li>I will abide by the traffic laws of the countries I visit.</li>
            <li>I will not use the IDP for any illegal activities.</li>
            <li>All information provided is true and correct to the best of my knowledge.</li>
            <li>I understand that any false information may result in rejection of my application.</li>
          </ul>
        </div>
      </div>

      <div className="flex justify-between items-end mb-8">
        <div>
          <p className="text-sm mb-2">Date: {formatDate(new Date().toISOString())}</p>
          <p className="text-sm">Place: ________________</p>
        </div>
        <div className="text-center">
          <div className="border-t border-black w-48 mb-2"></div>
          <p className="text-sm">Signature of Applicant</p>
          <p className="text-sm mt-1">{formatName(clientData?.firstName, clientData?.middleName, clientData?.lastName)}</p>
        </div>
      </div>

      <div className="border-t-2 border-black pt-4">
        <h3 className="font-bold mb-4">FOR OFFICE USE ONLY</h3>
        <table className="w-full border-collapse border border-black text-sm">
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Application Number</td>
            <td className="border border-black p-2">_________________________</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">IDP Number</td>
            <td className="border border-black p-2">_________________________</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Date of Issue</td>
            <td className="border border-black p-2">_________________________</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Valid Till</td>
            <td className="border border-black p-2">_________________________</td>
          </tr>
        </table>

        <div className="mt-6 text-right">
          <div className="border-t border-black w-64 ml-auto mb-2"></div>
          <p className="text-sm">Signature of Licensing Authority</p>
        </div>
      </div>
    </div>
  );
}