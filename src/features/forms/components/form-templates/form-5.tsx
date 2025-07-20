'use client';

import type { ClientDetail } from '@/server/db/client';

interface Form5TemplateProps {
  clientData: ClientDetail;
}

export function Form5Template({ clientData }: Form5TemplateProps) {
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
        <h1 className="text-xl font-bold mb-2">FORM 5</h1>
        <h2 className="text-lg font-semibold mb-2">DRIVING SCHOOL CERTIFICATE</h2>
        <p className="text-sm">[See rule 19A of the Central Motor Vehicle Rules, 1989]</p>
      </div>

      {/* Driving School Details */}
      <div className="mb-6">
        <h3 className="font-bold mb-4">DRIVING SCHOOL DETAILS:</h3>
        <table className="w-full border-collapse border border-black text-sm">
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50 w-1/3">Name of Driving School</td>
            <td className="border border-black p-2">_________________________________________</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">School Registration Number</td>
            <td className="border border-black p-2">_________________________________________</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">License Number</td>
            <td className="border border-black p-2">_________________________________________</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Address</td>
            <td className="border border-black p-2">_________________________________________</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Contact Number</td>
            <td className="border border-black p-2">_________________________________________</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Email Address</td>
            <td className="border border-black p-2">_________________________________________</td>
          </tr>
        </table>
      </div>

      {/* Student Details */}
      <div className="mb-6">
        <h3 className="font-bold mb-4">STUDENT DETAILS:</h3>
        <table className="w-full border-collapse border border-black text-sm">
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50 w-1/3">Student Name</td>
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
            <td className="border border-black p-2 font-medium bg-gray-50">Address</td>
            <td className="border border-black p-2">{clientData?.address || 'N/A'}, {clientData?.city || 'N/A'}, {clientData?.state || 'N/A'} - {clientData?.pincode || 'N/A'}</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Learner&apos;s Licence Number</td>
            <td className="border border-black p-2">_________________________________________</td>
          </tr>
        </table>
      </div>

      {/* Training Details */}
      <div className="mb-6">
        <h3 className="font-bold mb-4">TRAINING DETAILS:</h3>
        <table className="w-full border-collapse border border-black text-sm">
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Class of Vehicle Trained For</td>
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
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Course Start Date</td>
            <td className="border border-black p-2">_________________________________________</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Course End Date</td>
            <td className="border border-black p-2">_________________________________________</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Total Training Hours</td>
            <td className="border border-black p-2">_________ hours</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Theoretical Training Hours</td>
            <td className="border border-black p-2">_________ hours</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Practical Training Hours</td>
            <td className="border border-black p-2">_________ hours</td>
          </tr>
        </table>
      </div>

      {/* Training Curriculum */}
      <div className="mb-6">
        <h3 className="font-bold mb-4">TRAINING CURRICULUM COVERED:</h3>
        <div className="grid grid-cols-1 gap-2 text-sm">
          <h4 className="font-semibold">Theoretical Training:</h4>
          <div className="ml-4 space-y-1">
            <div>☐ Traffic Rules and Regulations</div>
            <div>☐ Road Signs and Signals</div>
            <div>☐ Motor Vehicle Act provisions</div>
            <div>☐ Traffic Safety and First Aid</div>
            <div>☐ Vehicle Maintenance basics</div>
            <div>☐ Environmental considerations</div>
          </div>
          
          <h4 className="font-semibold mt-4">Practical Training:</h4>
          <div className="ml-4 space-y-1">
            <div>☐ Vehicle inspection and pre-driving checks</div>
            <div>☐ Starting, stopping and parking</div>
            <div>☐ Gear changing and clutch operation</div>
            <div>☐ Steering control and vehicle maneuvering</div>
            <div>☐ Road driving in different traffic conditions</div>
            <div>☐ Emergency procedures and defensive driving</div>
          </div>
        </div>
      </div>

      {/* Assessment */}
      <div className="mb-6">
        <h3 className="font-bold mb-4">TRAINING ASSESSMENT:</h3>
        <table className="w-full border-collapse border border-black text-sm">
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Theoretical Test Score</td>
            <td className="border border-black p-2">_______ / 100</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Practical Test Result</td>
            <td className="border border-black p-2">☐ Pass ☐ Fail</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Overall Performance</td>
            <td className="border border-black p-2">☐ Excellent ☐ Good ☐ Satisfactory ☐ Needs Improvement</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Driving Skills Level</td>
            <td className="border border-black p-2">☐ Competent ☐ Needs More Practice</td>
          </tr>
        </table>
      </div>

      {/* Instructor Details */}
      <div className="mb-6">
        <h3 className="font-bold mb-4">INSTRUCTOR DETAILS:</h3>
        <table className="w-full border-collapse border border-black text-sm">
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Instructor Name</td>
            <td className="border border-black p-2">_________________________________________</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Instructor License Number</td>
            <td className="border border-black p-2">_________________________________________</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Experience (Years)</td>
            <td className="border border-black p-2">_________________________________________</td>
          </tr>
        </table>
      </div>

      {/* Certificate */}
      <div className="mb-8">
        <h3 className="font-bold mb-4">CERTIFICATE:</h3>
        <div className="border border-black p-4 text-sm space-y-3">
          <p>This is to certify that <strong>{formatName(clientData?.firstName, clientData?.middleName, clientData?.lastName)}</strong>, 
          holding Learner&apos;s Licence Number _________________, has successfully completed the driving training course 
          at our driving school.</p>
          
          <p>The candidate has:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Completed _______ hours of theoretical training</li>
            <li>Completed _______ hours of practical training</li>
            <li>Demonstrated competency in vehicle operation and road safety</li>
            <li>Passed all required assessments</li>
          </ul>
          
          <p>The candidate is recommended for the driving licence test for the class of vehicle: 
          <strong>_________________</strong></p>
        </div>
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-2 gap-8">
        <div className="text-center">
          <div className="border-t border-black w-full mb-2"></div>
          <p className="text-sm font-medium">Instructor Signature</p>
          <p className="text-sm">Name: _______________________</p>
          <p className="text-sm">Date: _______________________</p>
        </div>
        <div className="text-center">
          <div className="border-t border-black w-full mb-2"></div>
          <p className="text-sm font-medium">School Owner/Principal Signature</p>
          <p className="text-sm">Name: _______________________</p>
          <p className="text-sm">Date: _______________________</p>
        </div>
      </div>

      {/* School Seal */}
      <div className="mt-8 text-center">
        <div className="border-2 border-black rounded-full w-32 h-32 mx-auto flex items-center justify-center">
          <p className="text-xs">SCHOOL SEAL</p>
        </div>
      </div>
    </div>
  );
}