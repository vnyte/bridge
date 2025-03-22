import { createSchool } from './actions';
import { useFormState } from 'react-dom';

export default function OnboardingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome to Bridge
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Let&apos;s set up your driving school
          </p>
        </div>

        <OnboardingForm />
      </div>
    </div>
  );
}

function OnboardingForm() {
  const initialState = { message: '', error: false };
  const [state, formAction] = useFormState(createSchool, initialState);

  return (
    <form className="mt-8 space-y-6" action={formAction}>
      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <label htmlFor="school-name" className="sr-only">
            School Name
          </label>
          <input
            id="school-name"
            name="schoolName"
            type="text"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="School Name"
          />
        </div>
      </div>

      {state.message && (
        <div className={`text-sm ${state.error ? 'text-red-500' : 'text-green-500'}`}>
          {state.message}
        </div>
      )}

      <div>
        <button
          type="submit"
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create School
        </button>
      </div>
    </form>
  );
}
