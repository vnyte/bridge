'use client';

import type { ClientDetail } from '@/server/db/client';

interface Form8TemplateProps {
  clientData: ClientDetail;
}

export function Form8Template({ clientData }: Form8TemplateProps) {
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
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-xl font-bold mb-2">FORM 8</h1>
        <h2 className="text-lg font-semibold mb-2">APPLICATION FOR ADDING A NEW CLASS OF VEHICLE</h2>
        <p className="text-sm">[See rule 19B of the Central Motor Vehicle Rules, 1989]</p>
      </div>

      {/* RTO Details */}
      <div className="mb-6">
        <div className="border border-black p-4">
          <p className="text-sm mb-2">To,</p>
          <p className="text-sm mb-2">The Licensing Authority,</p>
          <p className="text-sm mb-2">Regional Transport Office,</p>
          <p className="text-sm">Maharashtra</p>
        </div>
      </div>

      {/* Applicant Information */}
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

      {/* Existing Driving Licence Details */}
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
            <td className="border border-black p-2 font-medium bg-gray-50">Current Class of Vehicle Authorized</td>
            <td className="border border-black p-2">
              <div className="grid grid-cols-4 gap-2">
                <div>☐ LMV</div>
                <div>☐ MCWG</div>
                <div>☐ MCWOG</div>
                <div>☐ MGV</div>
                <div>☐ MPV</div>
                <div>☐ HGV</div>
                <div>☐ HPV</div>
                <div>☐ Other: _______</div>
              </div>
            </td>
          </tr>
        </table>
      </div>

      {/* New Class of Vehicle */}
      <div className="mb-6">
        <h3 className="font-bold mb-4">NEW CLASS OF VEHICLE REQUESTED:</h3>
        <table className="w-full border-collapse border border-black text-sm">
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Class of Vehicle to be Added</td>
            <td className="border border-black p-2">
              <div className="grid grid-cols-4 gap-2">
                <div>☐ LMV</div>
                <div>☐ MCWG</div>
                <div>☐ MCWOG</div>
                <div>☐ MGV</div>
                <div>☐ MPV</div>
                <div>☐ HGV</div>
                <div>☐ HPV</div>
                <div>☐ Other: _______</div>
              </div>
            </td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Reason for Addition</td>
            <td className="border border-black p-2">
              <div className="space-y-1">
                <div>☐ Personal use</div>
                <div>☐ Commercial use</div>
                <div>☐ Employment requirement</div>
                <div>☐ Other: _________________________</div>
              </div>
            </td>
          </tr>
        </table>
      </div>

      {/* Training Details */}
      <div className="mb-6">
        <h3 className="font-bold mb-4">TRAINING DETAILS (if applicable):</h3>
        <table className="w-full border-collapse border border-black text-sm">
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Training Completed</td>
            <td className="border border-black p-2">☐ Yes ☐ No ☐ Not Applicable</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Driving School Name</td>
            <td className="border border-black p-2">_________________________________________</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Training Certificate Number</td>
            <td className="border border-black p-2">_________________________________________</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Training Period</td>
            <td className="border border-black p-2">From: _____________ To: _____________</td>
          </tr>
        </table>
      </div>

      {/* Test Details */}
      <div className="mb-6">
        <h3 className="font-bold mb-4">TEST DETAILS:</h3>
        <table className="w-full border-collapse border border-black text-sm">
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Test Required</td>
            <td className="border border-black p-2">☐ Written Test ☐ Practical Test ☐ Both</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Preferred Test Date</td>
            <td className="border border-black p-2">_________________________________________</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Preferred Test Time</td>
            <td className="border border-black p-2">_________________________________________</td>
          </tr>
        </table>
      </div>

      {/* Documents Attached */}
      <div className="mb-6">
        <h3 className="font-bold mb-4">DOCUMENTS ATTACHED:</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>☐ Duly filled Application Form 8</div>
          <div>☐ Original Driving Licence</div>
          <div>☐ Passport size photographs</div>
          <div>☐ Medical certificate (if required)</div>
          <div>☐ Training certificate (if applicable)</div>
          <div>☐ Fee receipt</div>
          <div>☐ Age proof (if not on existing DL)</div>
          <div>☐ Other: _____________________</div>
        </div>
      </div>

      {/* Declaration */}
      <div className="mb-6">
        <h3 className="font-bold mb-4">DECLARATION:</h3>
        <div className="border border-black p-4 text-sm space-y-2">
          <p>I, <strong>{formatName(clientData?.firstName, clientData?.middleName, clientData?.lastName)}</strong>, hereby declare that:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>I hold a valid driving licence as mentioned above.</li>
            <li>My existing driving licence has not been suspended or revoked.</li>
            <li>I have the necessary experience and training to drive the additional class of vehicle.</li>
            <li>All information provided in this application is true and correct.</li>
            <li>I am physically and mentally fit to drive the additional class of vehicle.</li>
            <li>I understand that any false information may result in rejection of my application.</li>
          </ul>
        </div>
      </div>

      {/* Signature Section */}
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

      {/* Office Use Only */}
      <div className="border-t-2 border-black pt-4">
        <h3 className="font-bold mb-4">FOR OFFICE USE ONLY</h3>
        <table className="w-full border-collapse border border-black text-sm">
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Application Number</td>
            <td className="border border-black p-2">_________________________</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Receipt Number</td>
            <td className="border border-black p-2">_________________________</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Fee Paid</td>
            <td className="border border-black p-2">₹ _______________________</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Test Date Allotted</td>
            <td className="border border-black p-2">_________________________</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Test Result</td>
            <td className="border border-black p-2">☐ Pass ☐ Fail</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Endorsement Date</td>
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