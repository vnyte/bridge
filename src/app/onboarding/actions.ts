'use server';

import { auth, currentUser } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { schools } from '@/db/schema';

type FormState = {
  message: string;
  error: boolean;
};

export async function createSchool(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await auth();
  const userId = session?.userId;
  const user = await currentUser();

  if (!userId || !user) {
    return {
      message: 'You must be signed in to create a school',
      error: true,
    };
  }

  const schoolName = formData.get('schoolName') as string;

  if (!schoolName || schoolName.trim() === '') {
    return {
      message: 'School name is required',
      error: true,
    };
  }

  try {
    // Create the school
    const newSchool = await db.insert(schools).values({
      name: schoolName.trim(),
      ownerId: userId,
    }).returning();

    // Update user metadata to mark onboarding as complete
    const client = await clerkClient();
    await client.users.updateUser(userId, {
      publicMetadata: {
        onboardingComplete: true,
        schoolId: newSchool[0].id,
      },
    });

    // Redirect to dashboard
    redirect('/');
  } catch (error) {
    console.error('Error creating school:', error);
    return {
      message: 'Failed to create school. Please try again.',
      error: true,
    };
  }
}
