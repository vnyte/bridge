import { SignUp } from '@clerk/nextjs';
import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up | Bridge',
  description: 'Create your Bridge account',
};

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp
        appearance={{
          elements: {
            formButtonPrimary: 'bg-primary text-primary-foreground hover:bg-primary/90',
            card: 'shadow-none',
          },
        }}
        afterSignUpUrl="/org-selection"
      />
    </div>
  );
}
