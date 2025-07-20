'use client';

import type { ClientDetail } from '@/server/db/client';

interface Form1TemplateProps {
  clientData: ClientDetail;
}

export function Form1Template({ clientData }: Form1TemplateProps) {
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

  const getGenderDisplay = (gender: string) => {
    switch (gender) {
      case 'MALE': return 'Male';
      case 'FEMALE': return 'Female';
      case 'OTHER': return 'Other';
      default: return gender;
    }
  };

  return (
    <div className="w-full h-full print:p-0">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-xl font-bold mb-2">FORM 1</h1>
        <h2 className="text-lg font-semibold mb-2">APPLICATION-CUM-DECLARATION</h2>
        <h3 className="text-md font-semibold mb-2">PHYSICAL FITNESS</h3>
        <p className="text-sm">[See rule 11(1) of the Central Motor Vehicle Rules, 1989]</p>
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
            <td className="border border-black p-2 font-medium bg-gray-50">Address</td>
            <td className="border border-black p-2">{clientData?.address || 'N/A'}, {clientData?.city || 'N/A'}, {clientData?.state || 'N/A'} - {clientData?.pincode || 'N/A'}</td>
          </tr>
        </table>
      </div>

      {/* Physical Fitness Declaration */}
      <div className="mb-6">
        <h3 className="font-bold mb-4">PHYSICAL FITNESS DECLARATION:</h3>
        
        <div className="text-sm space-y-4">
          <p className="font-medium">I hereby declare that:</p>
          
          <table className="w-full border-collapse border border-black">
            <tr>
              <td className="border border-black p-3 font-medium bg-gray-50">1. Vision</td>
              <td className="border border-black p-3">
                <div className="space-y-2">
                  <div>☐ Normal vision without glasses</div>
                  <div>☐ Vision corrected with glasses/contact lenses</div>
                  <div>☐ Color blind</div>
                  <div>☐ Night blind</div>
                </div>
              </td>
            </tr>
            <tr>
              <td className="border border-black p-3 font-medium bg-gray-50">2. Hearing</td>
              <td className="border border-black p-3">
                <div className="space-y-2">
                  <div>☐ Normal hearing</div>
                  <div>☐ Impaired hearing</div>
                  <div>☐ Uses hearing aid</div>
                </div>
              </td>
            </tr>
            <tr>
              <td className="border border-black p-3 font-medium bg-gray-50">3. Physical Disabilities</td>
              <td className="border border-black p-3">
                <div className="space-y-2">
                  <div>☐ No physical disabilities</div>
                  <div>☐ Missing limb(s): ________________</div>
                  <div>☐ Other disabilities: ________________</div>
                </div>
              </td>
            </tr>
            <tr>
              <td className="border border-black p-3 font-medium bg-gray-50">4. Medical Conditions</td>
              <td className="border border-black p-3">
                <div className="space-y-2">
                  <div>☐ No medical conditions affecting driving</div>
                  <div>☐ Diabetes</div>
                  <div>☐ Heart condition</div>
                  <div>☐ Epilepsy</div>
                  <div>☐ Mental illness</div>
                  <div>☐ Other: ________________</div>
                </div>
              </td>
            </tr>
            <tr>
              <td className="border border-black p-3 font-medium bg-gray-50">5. Medications</td>
              <td className="border border-black p-3">
                <div className="space-y-2">
                  <div>☐ Not taking any medications</div>
                  <div>☐ Taking medications that may affect driving ability</div>
                  <div>Details: ________________________________</div>
                </div>
              </td>
            </tr>
          </table>
        </div>
      </div>

      {/* Declaration Statement */}
      <div className="mb-6">
        <h3 className="font-bold mb-4">DECLARATION:</h3>
        <div className="text-sm space-y-3 border border-black p-4">
          <p>I, <strong>{formatName(clientData?.firstName, clientData?.middleName, clientData?.lastName)}</strong>, hereby solemnly declare that:</p>
          
          <ol className="list-decimal list-inside space-y-2 ml-4">
            <li>I am physically and mentally fit to drive a motor vehicle.</li>
            <li>I do not suffer from any disease or disability that would make me unfit to drive.</li>
            <li>I have disclosed all relevant medical conditions and medications above.</li>
            <li>I understand that providing false information may result in rejection of my application or cancellation of licence.</li>
            <li>I will inform the licensing authority of any change in my physical or mental condition that may affect my driving ability.</li>
            <li>I understand that I may be required to undergo medical examination if deemed necessary by the licensing authority.</li>
          </ol>
          
          <p className="mt-4">I make this declaration believing it to be true and correct.</p>
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

      {/* Medical Examiner Section */}
      <div className="border-t-2 border-black pt-6">
        <h3 className="font-bold mb-4">FOR MEDICAL EXAMINER (if required):</h3>
        
        <table className="w-full border-collapse border border-black text-sm">
          <tr>
            <td className="border border-black p-3 font-medium bg-gray-50">Medical Examiner Name</td>
            <td className="border border-black p-3">________________________________</td>
          </tr>
          <tr>
            <td className="border border-black p-3 font-medium bg-gray-50">Registration Number</td>
            <td className="border border-black p-3">________________________________</td>
          </tr>
          <tr>
            <td className="border border-black p-3 font-medium bg-gray-50">Date of Examination</td>
            <td className="border border-black p-3">________________________________</td>
          </tr>
          <tr>
            <td className="border border-black p-3 font-medium bg-gray-50">Medical Fitness Status</td>
            <td className="border border-black p-3">
              <div className="space-y-2">
                <div>☐ Fit to drive</div>
                <div>☐ Fit to drive with restrictions</div>
                <div>☐ Unfit to drive</div>
              </div>
            </td>
          </tr>
          <tr>
            <td className="border border-black p-3 font-medium bg-gray-50">Restrictions/Comments</td>
            <td className="border border-black p-3">
              <div className="h-20">________________________________</div>
            </td>
          </tr>
        </table>
        
        <div className="mt-6 text-right">
          <div className="border-t border-black w-64 ml-auto mb-2"></div>
          <p className="text-sm">Signature and Stamp of Medical Examiner</p>
        </div>
      </div>
    </div>
  );
}