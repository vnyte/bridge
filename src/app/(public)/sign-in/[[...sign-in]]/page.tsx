import { SignIn } from '@clerk/nextjs';
import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | Bridge',
  description: 'Sign in to your Bridge account',
};

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn
        appearance={{
          elements: {
            formButtonPrimary: 'bg-primary text-primary-foreground hover:bg-primary/90',
            card: 'shadow-none',
          },
        }}
        afterSignInUrl="/org-selection"
      />
    </div>
  );
}
