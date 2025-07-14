import { SignIn } from '@clerk/nextjs';
import { type Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Sign In | Bridge',
  description: 'Sign in to your Bridge account',
};

export default function SignInPage() {
  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-1/2 lg:block">
        <Image src="/login.png" alt="Login" fill className="object-cover object-center" priority />
      </div>
      <div className="flex w-full items-center justify-center lg:w-1/2">
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary: 'bg-primary text-primary-foreground hover:bg-primary/90',
              card: 'shadow-none',
            },
          }}
        />
      </div>
    </div>
  );
}
