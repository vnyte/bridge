'use client';

import { SettingsForm } from './settings-form';
import { useBranchSettings } from '../hooks/settings';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SettingsPageProps {
  branchId: string;
}

export const SettingsPage = ({ branchId }: SettingsPageProps) => {
  const { data: settings, isLoading, error } = useBranchSettings(branchId);

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Error Loading Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500">Failed to load branch settings. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Branch Settings</h1>
          <p className="text-muted-foreground">
            Configure working days and operating hours for your branch
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-96" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-96" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        </div>
      ) : (
        <SettingsForm branchId={branchId} initialData={settings} />
      )}
    </div>
  );
};
