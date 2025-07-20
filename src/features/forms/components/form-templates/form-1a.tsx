'use client';

import type { ClientDetail } from '@/server/db/client';

interface Form1ATemplateProps {
  clientData: ClientDetail;
}

export function Form1ATemplate({ clientData }: Form1ATemplateProps) {
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

  const getAge = (birthDate?: string | null) => {
    if (!birthDate) return 'N/A';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="w-full h-full print:p-0">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-xl font-bold mb-2">FORM 1A</h1>
        <h2 className="text-lg font-semibold mb-2">MEDICAL CERTIFICATE</h2>
        <p className="text-sm">[See rule 11(2) of the Central Motor Vehicle Rules, 1989]</p>
      </div>

      {/* Patient Information */}
      <div className="mb-6">
        <h3 className="font-bold mb-4">PATIENT INFORMATION:</h3>
        
        <table className="w-full border-collapse border border-black text-sm">
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50 w-1/3">Full Name</td>
            <td className="border border-black p-2">{formatName(clientData?.firstName, clientData?.middleName, clientData?.lastName)}</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Date of Birth</td>
            <td className="border border-black p-2">{clientData?.birthDate ? formatDate(clientData.birthDate) : 'N/A'}</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Age</td>
            <td className="border border-black p-2">{getAge(clientData?.birthDate)} {typeof getAge(clientData?.birthDate) === 'number' ? 'years' : ''}</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Gender</td>
            <td className="border border-black p-2">{clientData?.gender || 'N/A'}</td>
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

      {/* Medical Examination */}
      <div className="mb-6">
        <h3 className="font-bold mb-4">MEDICAL EXAMINATION DETAILS:</h3>
        
        <table className="w-full border-collapse border border-black text-sm">
          <tr>
            <td className="border border-black p-3 font-medium bg-gray-50">Date of Examination</td>
            <td className="border border-black p-3">_______________________</td>
          </tr>
          <tr>
            <td className="border border-black p-3 font-medium bg-gray-50">Height</td>
            <td className="border border-black p-3">________ cm</td>
          </tr>
          <tr>
            <td className="border border-black p-3 font-medium bg-gray-50">Weight</td>
            <td className="border border-black p-3">________ kg</td>
          </tr>
          <tr>
            <td className="border border-black p-3 font-medium bg-gray-50">Blood Pressure</td>
            <td className="border border-black p-3">________ / ________ mmHg</td>
          </tr>
          <tr>
            <td className="border border-black p-3 font-medium bg-gray-50">Pulse Rate</td>
            <td className="border border-black p-3">________ per minute</td>
          </tr>
        </table>
      </div>

      {/* Vision Test */}
      <div className="mb-6">
        <h3 className="font-bold mb-4">VISION EXAMINATION:</h3>
        
        <table className="w-full border-collapse border border-black text-sm">
          <tr>
            <td className="border border-black p-3 font-medium bg-gray-50">Right Eye (6/6)</td>
            <td className="border border-black p-3">
              <div className="space-y-1">
                <div>☐ Normal ☐ Defective</div>
                <div>Without glasses: 6/____</div>
                <div>With glasses: 6/____</div>
              </div>
            </td>
          </tr>
          <tr>
            <td className="border border-black p-3 font-medium bg-gray-50">Left Eye (6/6)</td>
            <td className="border border-black p-3">
              <div className="space-y-1">
                <div>☐ Normal ☐ Defective</div>
                <div>Without glasses: 6/____</div>
                <div>With glasses: 6/____</div>
              </div>
            </td>
          </tr>
          <tr>
            <td className="border border-black p-3 font-medium bg-gray-50">Color Vision</td>
            <td className="border border-black p-3">☐ Normal ☐ Defective</td>
          </tr>
          <tr>
            <td className="border border-black p-3 font-medium bg-gray-50">Night Vision</td>
            <td className="border border-black p-3">☐ Normal ☐ Defective</td>
          </tr>
          <tr>
            <td className="border border-black p-3 font-medium bg-gray-50">Field of Vision</td>
            <td className="border border-black p-3">☐ Normal ☐ Restricted</td>
          </tr>
        </table>
      </div>

      {/* Hearing Test */}
      <div className="mb-6">
        <h3 className="font-bold mb-4">HEARING EXAMINATION:</h3>
        
        <table className="w-full border-collapse border border-black text-sm">
          <tr>
            <td className="border border-black p-3 font-medium bg-gray-50">Right Ear</td>
            <td className="border border-black p-3">☐ Normal ☐ Impaired ☐ Deaf</td>
          </tr>
          <tr>
            <td className="border border-black p-3 font-medium bg-gray-50">Left Ear</td>
            <td className="border border-black p-3">☐ Normal ☐ Impaired ☐ Deaf</td>
          </tr>
          <tr>
            <td className="border border-black p-3 font-medium bg-gray-50">Hearing Aid Used</td>
            <td className="border border-black p-3">☐ Yes ☐ No</td>
          </tr>
        </table>
      </div>

      {/* Physical Examination */}
      <div className="mb-6">
        <h3 className="font-bold mb-4">PHYSICAL EXAMINATION:</h3>
        
        <table className="w-full border-collapse border border-black text-sm">
          <tr>
            <td className="border border-black p-3 font-medium bg-gray-50">Right Arm</td>
            <td className="border border-black p-3">☐ Normal ☐ Deformed ☐ Amputated</td>
          </tr>
          <tr>
            <td className="border border-black p-3 font-medium bg-gray-50">Left Arm</td>
            <td className="border border-black p-3">☐ Normal ☐ Deformed ☐ Amputated</td>
          </tr>
          <tr>
            <td className="border border-black p-3 font-medium bg-gray-50">Right Leg</td>
            <td className="border border-black p-3">☐ Normal ☐ Deformed ☐ Amputated</td>
          </tr>
          <tr>
            <td className="border border-black p-3 font-medium bg-gray-50">Left Leg</td>
            <td className="border border-black p-3">☐ Normal ☐ Deformed ☐ Amputated</td>
          </tr>
          <tr>
            <td className="border border-black p-3 font-medium bg-gray-50">Spine</td>
            <td className="border border-black p-3">☐ Normal ☐ Deformed</td>
          </tr>
        </table>
      </div>

      {/* Medical History */}
      <div className="mb-6">
        <h3 className="font-bold mb-4">MEDICAL HISTORY:</h3>
        
        <table className="w-full border-collapse border border-black text-sm">
          <tr>
            <td className="border border-black p-3 font-medium bg-gray-50">Diabetes</td>
            <td className="border border-black p-3">☐ Yes ☐ No | If yes, controlled: ☐ Yes ☐ No</td>
          </tr>
          <tr>
            <td className="border border-black p-3 font-medium bg-gray-50">Hypertension</td>
            <td className="border border-black p-3">☐ Yes ☐ No | If yes, controlled: ☐ Yes ☐ No</td>
          </tr>
          <tr>
            <td className="border border-black p-3 font-medium bg-gray-50">Heart Disease</td>
            <td className="border border-black p-3">☐ Yes ☐ No</td>
          </tr>
          <tr>
            <td className="border border-black p-3 font-medium bg-gray-50">Epilepsy</td>
            <td className="border border-black p-3">☐ Yes ☐ No</td>
          </tr>
          <tr>
            <td className="border border-black p-3 font-medium bg-gray-50">Mental Illness</td>
            <td className="border border-black p-3">☐ Yes ☐ No</td>
          </tr>
          <tr>
            <td className="border border-black p-3 font-medium bg-gray-50">Substance Abuse</td>
            <td className="border border-black p-3">☐ Yes ☐ No</td>
          </tr>
          <tr>
            <td className="border border-black p-3 font-medium bg-gray-50">Other Conditions</td>
            <td className="border border-black p-3">_______________________________</td>
          </tr>
        </table>
      </div>

      {/* Medical Certificate */}
      <div className="mb-8">
        <h3 className="font-bold mb-4">MEDICAL CERTIFICATE:</h3>
        <div className="border border-black p-4 text-sm space-y-3">
          <p>I hereby certify that I have examined <strong>{formatName(clientData?.firstName, clientData?.middleName, clientData?.lastName)}</strong> and found him/her:</p>
          
          <div className="space-y-2 ml-4">
            <div>☐ <strong>FIT</strong> to drive motor vehicle of the class applied for</div>
            <div>☐ <strong>FIT</strong> to drive motor vehicle with the following restrictions:</div>
            <div className="ml-6">_________________________________________________</div>
            <div>☐ <strong>UNFIT</strong> to drive motor vehicle</div>
          </div>
          
          <p className="mt-4">This certificate is valid for a period of ________ months from the date of issue.</p>
        </div>
      </div>

      {/* Doctor's Details */}
      <div className="mb-6">
        <h3 className="font-bold mb-4">MEDICAL PRACTITIONER DETAILS:</h3>
        
        <table className="w-full border-collapse border border-black text-sm">
          <tr>
            <td className="border border-black p-3 font-medium bg-gray-50">Name</td>
            <td className="border border-black p-3">_______________________________</td>
          </tr>
          <tr>
            <td className="border border-black p-3 font-medium bg-gray-50">Registration Number</td>
            <td className="border border-black p-3">_______________________________</td>
          </tr>
          <tr>
            <td className="border border-black p-3 font-medium bg-gray-50">Qualification</td>
            <td className="border border-black p-3">_______________________________</td>
          </tr>
          <tr>
            <td className="border border-black p-3 font-medium bg-gray-50">Address</td>
            <td className="border border-black p-3">_______________________________</td>
          </tr>
          <tr>
            <td className="border border-black p-3 font-medium bg-gray-50">Contact Number</td>
            <td className="border border-black p-3">_______________________________</td>
          </tr>
        </table>
      </div>

      {/* Signature Section */}
      <div className="flex justify-between items-end">
        <div>
          <p className="text-sm mb-2">Date: ________________</p>
          <p className="text-sm">Place: ________________</p>
        </div>
        <div className="text-center">
          <div className="border-t border-black w-64 mb-2"></div>
          <p className="text-sm">Signature and Stamp of Medical Practitioner</p>
        </div>
      </div>
    </div>
  );
}