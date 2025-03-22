import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { db } from '@/db';
import { schools } from '@/db/schema';
import { eq } from 'drizzle-orm';

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const { userId, isLoaded } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    async function checkOnboardingStatus() {
      if (!isLoaded || !userId) return;

      try {
        // Check if the user has any associated schools
        const userSchools = await db.query.schools.findFirst({
          where: eq(schools.ownerId, userId),
        });

        // If no schools found, user needs onboarding
        if (!userSchools) {
          setNeedsOnboarding(true);
          router.push('/onboarding');
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      } finally {
        setIsLoading(false);
      }
    }

    checkOnboardingStatus();
  }, [isLoaded, userId, router]);

  if (!isLoaded || isLoading) {
    return <div>Loading...</div>; // You can replace this with a proper loading component
  }

  if (needsOnboarding) {
    return null; // Don't render children, user will be redirected to onboarding
  }

  return <>{children}</>;
}
