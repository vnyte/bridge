'use client';

import type { ClientDetail } from '@/server/db/client';

interface Form4TemplateProps {
  clientData: ClientDetail;
}

export function Form4Template({ clientData }: Form4TemplateProps) {
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
        <h1 className="text-xl font-bold mb-2">FORM 4</h1>
        <h2 className="text-lg font-semibold mb-2">APPLICATION FOR PERMANENT DRIVING LICENCE</h2>
        <p className="text-sm">[See rule 19 of the Central Motor Vehicle Rules, 1989]</p>
      </div>

      {/* RTO Address */}
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
            <td className="border border-black p-2 font-medium bg-gray-50">Blood Group</td>
            <td className="border border-black p-2">{clientData?.bloodGroup || 'N/A'}</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Mobile Number</td>
            <td className="border border-black p-2">{clientData?.phoneNumber || 'N/A'}</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Email Address</td>
            <td className="border border-black p-2">{clientData?.email || 'N/A'}</td>
          </tr>
        </table>
      </div>

      {/* Present Address */}
      <div className="mb-6">
        <h3 className="font-bold mb-4">PRESENT ADDRESS:</h3>
        <table className="w-full border-collapse border border-black text-sm">
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Address</td>
            <td className="border border-black p-2">{clientData?.address || 'N/A'}</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">City</td>
            <td className="border border-black p-2">{clientData?.city || 'N/A'}</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">State</td>
            <td className="border border-black p-2">{clientData?.state || 'N/A'}</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">PIN Code</td>
            <td className="border border-black p-2">{clientData?.pincode || 'N/A'}</td>
          </tr>
        </table>
      </div>

      {/* Learner's Licence Details */}
      <div className="mb-6">
        <h3 className="font-bold mb-4">LEARNER&apos;S LICENCE DETAILS:</h3>
        <table className="w-full border-collapse border border-black text-sm">
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Learner&apos;s Licence Number</td>
            <td className="border border-black p-2">_________________________________</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Date of Issue</td>
            <td className="border border-black p-2">_________________________________</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Issuing Authority</td>
            <td className="border border-black p-2">_________________________________</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Class of Vehicle</td>
            <td className="border border-black p-2">
              <div className="grid grid-cols-3 gap-2">
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

      {/* Driving Test Details */}
      <div className="mb-6">
        <h3 className="font-bold mb-4">DRIVING TEST DETAILS:</h3>
        <table className="w-full border-collapse border border-black text-sm">
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Test Date</td>
            <td className="border border-black p-2">_________________________________</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Test Time</td>
            <td className="border border-black p-2">_________________________________</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Test Venue</td>
            <td className="border border-black p-2">_________________________________</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Vehicle Registration Number</td>
            <td className="border border-black p-2">_________________________________</td>
          </tr>
        </table>
      </div>

      {/* Documents Submitted */}
      <div className="mb-6">
        <h3 className="font-bold mb-4">DOCUMENTS SUBMITTED:</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>☐ Application Form 4 (duly filled)</div>
          <div>☐ Learner&apos;s Licence (original)</div>
          <div>☐ Passport size photographs</div>
          <div>☐ Age proof</div>
          <div>☐ Address proof</div>
          <div>☐ Medical certificate (if required)</div>
          <div>☐ Driving training certificate</div>
          <div>☐ Fee receipt</div>
        </div>
      </div>

      {/* Declaration */}
      <div className="mb-6">
        <h3 className="font-bold mb-4">DECLARATION:</h3>
        <div className="border border-black p-4 text-sm space-y-2">
          <p>I, <strong>{formatName(clientData?.firstName, clientData?.middleName, clientData?.lastName)}</strong>, hereby declare that:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>I have held the learner&apos;s licence for a minimum period of 30 days.</li>
            <li>I have completed the required training as per the Motor Vehicle Act.</li>
            <li>All information provided in this application is true and correct to the best of my knowledge.</li>
            <li>I am physically and mentally fit to drive a motor vehicle.</li>
            <li>I will abide by all traffic rules and regulations.</li>
            <li>I understand that any false information may result in rejection of my application or cancellation of licence.</li>
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

      {/* For Office Use Only */}
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
            <td className="border border-black p-2 font-medium bg-gray-50">Test Result</td>
            <td className="border border-black p-2">☐ Pass ☐ Fail</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">DL Number Issued</td>
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