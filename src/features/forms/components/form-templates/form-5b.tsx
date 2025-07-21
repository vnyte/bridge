'use client';

import type { ClientDetail } from '@/server/db/client';

interface Form5BTemplateProps {
  clientData: ClientDetail;
}

export function Form5BTemplate({ clientData }: Form5BTemplateProps) {
  const formatName = (first?: string | null, middle?: string | null, last?: string | null) => {
    return [first, middle, last].filter(Boolean).join(' ');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="w-full h-full print:p-0">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-xl font-bold mb-2">FORM 5B</h1>
        <h2 className="text-lg font-semibold mb-2">
          ACCREDITED DRIVER TRAINING CENTRE (ADTC) CERTIFICATE
        </h2>
        <p className="text-sm">[See rule 31E(iii) of the Central Motor Vehicle Rules, 1989]</p>
        <p className="text-sm font-medium text-red-600 mt-2">*** EXEMPTS FROM DRIVING TEST ***</p>
      </div>

      {/* ADTC Details */}
      <div className="mb-6">
        <h3 className="font-bold mb-4">ACCREDITED DRIVER TRAINING CENTRE (ADTC) DETAILS:</h3>
        <table className="w-full border-collapse border border-black text-sm">
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50 w-1/3">Name of ADTC</td>
            <td className="border border-black p-2">_________________________________________</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">
              ADTC Registration Number
            </td>
            <td className="border border-black p-2">_________________________________________</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">ADTC License Number</td>
            <td className="border border-black p-2">_________________________________________</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">
              Accreditation Authority
            </td>
            <td className="border border-black p-2">State Transport Authority, Maharashtra</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">
              Accreditation Valid Till
            </td>
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
            <td className="border border-black p-2">
              {formatName(clientData?.firstName, clientData?.middleName, clientData?.lastName)}
            </td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">
              Father&apos;s/Guardian&apos;s Name
            </td>
            <td className="border border-black p-2">
              {formatName(
                clientData?.guardianFirstName,
                clientData?.guardianMiddleName,
                clientData?.guardianLastName
              )}
            </td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Date of Birth</td>
            <td className="border border-black p-2">
              {clientData?.birthDate ? formatDate(clientData.birthDate) : 'N/A'}
            </td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Aadhaar Number</td>
            <td className="border border-black p-2">{clientData?.aadhaarNumber || 'N/A'}</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Mobile Number</td>
            <td className="border border-black p-2">{clientData?.phoneNumber || 'N/A'}</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Address</td>
            <td className="border border-black p-2">
              {clientData?.address || 'N/A'}, {clientData?.city || 'N/A'},{' '}
              {clientData?.state || 'N/A'} - {clientData?.pincode || 'N/A'}
            </td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">
              Learner&apos;s Licence Number
            </td>
            <td className="border border-black p-2">
              {clientData?.learningLicense?.licenseNumber ||
                '_________________________________________'}
            </td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">
              Learner&apos;s Licence Issue Date
            </td>
            <td className="border border-black p-2">
              {clientData?.learningLicense?.issueDate
                ? formatDate(clientData.learningLicense.issueDate)
                : '_________________________________________'}
            </td>
          </tr>
        </table>
      </div>

      {/* Training Details */}
      <div className="mb-6">
        <h3 className="font-bold mb-4">ADTC TRAINING DETAILS:</h3>
        <table className="w-full border-collapse border border-black text-sm">
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">
              Class of Vehicle Trained For
            </td>
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
            <td className="border border-black p-2 font-medium bg-gray-50">
              Total Training Hours (Minimum 30 hrs)
            </td>
            <td className="border border-black p-2">_________ hours</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">
              Theoretical Training Hours
            </td>
            <td className="border border-black p-2">_________ hours</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">
              Practical Training Hours
            </td>
            <td className="border border-black p-2">_________ hours</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">
              Simulator Training Hours
            </td>
            <td className="border border-black p-2">_________ hours</td>
          </tr>
        </table>
      </div>

      {/* Enhanced Training Curriculum */}
      <div className="mb-6">
        <h3 className="font-bold mb-4">ADTC TRAINING CURRICULUM COVERED:</h3>
        <div className="grid grid-cols-1 gap-2 text-sm">
          <h4 className="font-semibold">Theoretical Training (Minimum 10 hours):</h4>
          <div className="ml-4 space-y-1">
            <div>☐ Traffic Rules and Regulations (Motor Vehicle Act 1988)</div>
            <div>☐ Road Signs, Signals and Markings</div>
            <div>☐ Right of Way and Traffic Management</div>
            <div>☐ Traffic Safety and First Aid</div>
            <div>☐ Vehicle Technology and Maintenance</div>
            <div>☐ Environmental considerations and Fuel Efficiency</div>
            <div>☐ Emergency Response and Accident Prevention</div>
            <div>☐ Pedestrian and Cyclist Safety</div>
          </div>

          <h4 className="font-semibold mt-4">Practical Training (Minimum 15 hours):</h4>
          <div className="ml-4 space-y-1">
            <div>☐ Pre-driving inspection and safety checks</div>
            <div>☐ Starting, stopping and parking techniques</div>
            <div>☐ Gear changing and clutch operation</div>
            <div>☐ Steering control and vehicle maneuvering</div>
            <div>☐ Road driving in various traffic conditions</div>
            <div>☐ Highway and urban driving</div>
            <div>☐ Night and adverse weather driving</div>
            <div>☐ Emergency procedures and defensive driving</div>
            <div>☐ Parking (parallel, reverse, three-point turn)</div>
          </div>

          <h4 className="font-semibold mt-4">Simulator Training (Minimum 5 hours):</h4>
          <div className="ml-4 space-y-1">
            <div>☐ Hazard perception and reaction training</div>
            <div>☐ Emergency scenario handling</div>
            <div>☐ Weather and road condition simulation</div>
            <div>☐ Traffic situation awareness</div>
          </div>
        </div>
      </div>

      {/* Assessment */}
      <div className="mb-6">
        <h3 className="font-bold mb-4">ADTC TRAINING ASSESSMENT:</h3>
        <table className="w-full border-collapse border border-black text-sm">
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">
              Theoretical Test Score (Minimum 60%)
            </td>
            <td className="border border-black p-2">_______ / 100</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">
              Practical Test Result
            </td>
            <td className="border border-black p-2">☐ Pass ☐ Fail</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">
              Simulator Test Result
            </td>
            <td className="border border-black p-2">☐ Pass ☐ Fail</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Overall Performance</td>
            <td className="border border-black p-2">☐ Excellent ☐ Good ☐ Satisfactory</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">
              Driving Competency Level
            </td>
            <td className="border border-black p-2">☐ Road Ready ☐ Needs Improvement</td>
          </tr>
        </table>
      </div>

      {/* Certified Instructor Details */}
      <div className="mb-6">
        <h3 className="font-bold mb-4">CERTIFIED INSTRUCTOR DETAILS:</h3>
        <table className="w-full border-collapse border border-black text-sm">
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">
              Chief Instructor Name
            </td>
            <td className="border border-black p-2">_________________________________________</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">
              Instructor License Number
            </td>
            <td className="border border-black p-2">_________________________________________</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">
              Instructor Certification Authority
            </td>
            <td className="border border-black p-2">_________________________________________</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-medium bg-gray-50">Experience (Years)</td>
            <td className="border border-black p-2">_________________________________________</td>
          </tr>
        </table>
      </div>

      {/* ADTC Certificate */}
      <div className="mb-8">
        <h3 className="font-bold mb-4">ADTC CERTIFICATE:</h3>
        <div className="border-2 border-black p-4 text-sm space-y-3">
          <p className="text-center font-bold text-lg">CERTIFICATE OF SUCCESSFUL COMPLETION</p>

          <p>
            This is to certify that{' '}
            <strong>
              {formatName(clientData?.firstName, clientData?.middleName, clientData?.lastName)}
            </strong>
            , holding Learner&apos;s Licence Number{' '}
            <strong>{clientData?.learningLicense?.licenseNumber || '________________'}</strong>, has
            successfully completed the Accredited Driver Training Course at our ADTC facility.
          </p>

          <p>
            <strong>The candidate has:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>
              Completed minimum 30 hours of structured training (10 hrs theoretical, 15 hrs
              practical, 5 hrs simulator)
            </li>
            <li>
              Passed all required theoretical and practical assessments with minimum 60% marks
            </li>
            <li>Demonstrated competency in safe vehicle operation and traffic rule compliance</li>
            <li>Successfully completed hazard perception and emergency response training</li>
            <li>Met all ADTC accreditation standards as per CMVR 1989 Rules 31B-31J</li>
          </ul>

          <p className="font-bold text-red-600">
            The candidate is EXEMPT from the driving test requirement and is recommended for direct
            issuance of driving licence for the class of vehicle: <strong>_________________</strong>
          </p>

          <p className="text-xs mt-4">
            <strong>Note:</strong> This certificate is valid as per Rule 31E(iii) of CMVR 1989 and
            exempts the holder from driving test under proviso to sub-rule (2) of Rule 15 of CMVR
            1989. However, the licensing authority retains the final power to issue the driving
            licence.
          </p>
        </div>
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-2 gap-8 mb-6">
        <div className="text-center">
          <div className="border-t border-black w-full mb-2"></div>
          <p className="text-sm font-medium">Chief Instructor Signature</p>
          <p className="text-sm">Name: _______________________</p>
          <p className="text-sm">License No: __________________</p>
          <p className="text-sm">Date: _______________________</p>
        </div>
        <div className="text-center">
          <div className="border-t border-black w-full mb-2"></div>
          <p className="text-sm font-medium">ADTC Director/Principal Signature</p>
          <p className="text-sm">Name: _______________________</p>
          <p className="text-sm">ADTC Reg No: _________________</p>
          <p className="text-sm">Date: _______________________</p>
        </div>
      </div>

      {/* ADTC Seal and QR Code */}
      <div className="flex justify-between items-center mt-8">
        <div className="text-center">
          <div className="border-2 border-black rounded-full w-32 h-32 flex items-center justify-center">
            <p className="text-xs">ADTC OFFICIAL SEAL</p>
          </div>
        </div>
        <div className="text-center">
          <div className="border border-black w-24 h-24 flex items-center justify-center">
            <p className="text-xs">QR CODE FOR VERIFICATION</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-xs text-gray-600">
        <p>This certificate is digitally verifiable through the State Transport Authority portal</p>
        <p>Certificate No: _________________ | Issue Date: _________________</p>
      </div>
    </div>
  );
}
