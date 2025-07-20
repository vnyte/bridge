'use client';

import type { ClientDetail } from '@/server/db/client';

interface Form2TemplateProps {
  clientData: ClientDetail;
}

export function Form2Template({ clientData }: Form2TemplateProps) {
  const formatName = (first?: string | null, middle?: string | null, last?: string | null) => {
    return [first, middle, last].filter(Boolean).join(' ');
  };

  const getGenderDisplay = (gender: string) => {
    switch (gender) {
      case 'MALE': return 'Male';
      case 'FEMALE': return 'Female';
      case 'OTHER': return 'Other';
      default: return gender;
    }
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
        <h1 className="text-xl font-bold mb-2">FORM 2</h1>
        <h2 className="text-lg font-semibold mb-2">APPLICATION FOR LEARNER&apos;S LICENCE</h2>
        <p className="text-sm">[See rule 12 and 13 of the Central Motor Vehicle Rules, 1989]</p>
      </div>

      {/* RTO Section */}
      <div className="mb-6">
        <div className="border border-black p-4">
          <p className="text-sm mb-2">To,</p>
          <p className="text-sm mb-2">The Licensing Authority,</p>
          <p className="text-sm mb-2">Regional Transport Office,</p>
          <p className="text-sm">Maharashtra</p>
        </div>
      </div>

      {/* Application Details */}
      <div className="mb-6">
        <h3 className="font-bold mb-4">1. Application for:</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>☐ Fresh Learner&apos;s Licence</div>
          <div>☐ Addition of Class of Vehicle</div>
          <div>☐ Renewal of Learner&apos;s Licence</div>
          <div>☐ Other: ________________</div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="mb-6">
        <h3 className="font-bold mb-4">2. Personal Information:</h3>
        
        <table className="w-full border-collapse border border-black text-sm">
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Full Name</td>
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
            <td className="border border-black p-2 font-medium bg-gray-50">Gender</td>
            <td className="border border-black p-2">{clientData?.gender ? getGenderDisplay(clientData.gender) : 'N/A'}</td>
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

      {/* Address Information */}
      <div className="mb-6">
        <h3 className="font-bold mb-4">3. Address Information:</h3>
        
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Present Address:</h4>
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

        <div className="mb-4">
          <h4 className="font-semibold mb-2">Permanent Address:</h4>
          <table className="w-full border-collapse border border-black text-sm">
            <tr>
              <td className="border border-black p-2 font-medium bg-gray-50">Address</td>
              <td className="border border-black p-2">{clientData?.permanentAddress || 'N/A'}</td>
            </tr>
            <tr>
              <td className="border border-black p-2 font-medium bg-gray-50">City</td>
              <td className="border border-black p-2">{clientData?.permanentCity || 'N/A'}</td>
            </tr>
            <tr>
              <td className="border border-black p-2 font-medium bg-gray-50">State</td>
              <td className="border border-black p-2">{clientData?.permanentState || 'N/A'}</td>
            </tr>
            <tr>
              <td className="border border-black p-2 font-medium bg-gray-50">PIN Code</td>
              <td className="border border-black p-2">{clientData?.permanentPincode || 'N/A'}</td>
            </tr>
          </table>
        </div>
      </div>

      {/* Class of Vehicle */}
      <div className="mb-6">
        <h3 className="font-bold mb-4">4. Class of Vehicle for which licence is sought:</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>☐ LMV (Light Motor Vehicle)</div>
          <div>☐ MCWG (Motor Cycle with Gear)</div>
          <div>☐ MCWOG (Motor Cycle without Gear)</div>
          <div>☐ MGV (Medium Goods Vehicle)</div>
          <div>☐ MPV (Medium Passenger Vehicle)</div>
          <div>☐ HGV (Heavy Goods Vehicle)</div>
          <div>☐ HPV (Heavy Passenger Vehicle)</div>
          <div>☐ Other: ________________</div>
        </div>
      </div>

      {/* Declaration */}
      <div className="mb-8">
        <h3 className="font-bold mb-4">5. Declaration:</h3>
        <div className="text-sm space-y-2">
          <p>I hereby declare that:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>The information provided above is true and correct to the best of my knowledge.</li>
            <li>I have not been disqualified from holding or obtaining a driving licence.</li>
            <li>I am not suffering from any disease or disability that would make me unfit to drive a motor vehicle.</li>
            <li>I understand that any false information may result in rejection of my application.</li>
          </ul>
        </div>
      </div>

      {/* Signature Section */}
      <div className="flex justify-between items-end">
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
      <div className="mt-8 border-t-2 border-black pt-4">
        <h3 className="font-bold mb-4">FOR OFFICE USE ONLY</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p>Application No.: ________________</p>
            <p>Receipt No.: ________________</p>
            <p>Date: ________________</p>
          </div>
          <div>
            <p>Test Date: ________________</p>
            <p>Test Result: ________________</p>
            <p>Licence No.: ________________</p>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm">Remarks: ________________________________________________</p>
        </div>
        <div className="mt-4 text-right">
          <div className="border-t border-black w-48 ml-auto mb-2"></div>
          <p className="text-sm">Signature of Licensing Authority</p>
        </div>
      </div>
    </div>
  );
}