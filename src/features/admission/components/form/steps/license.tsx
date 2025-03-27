'use client';

import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import { LicenseClassEnum } from '@/db/schema/enums';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TypographyH5 } from '@/components/ui/typography';
import { AdmissionFormValues } from '@/features/admission/types';
import { Checkbox } from '@/components/ui/checkbox';

export const LicenseStep = () => {
  const { control, setValue, watch } = useFormContext<AdmissionFormValues>();
  const selectedClasses = watch('learningLicense.class') || [];

  const handleClassToggle = (
    value: (typeof LicenseClassEnum.enumValues)[number],
    checked: boolean
  ) => {
    const currentClasses = [...selectedClasses] as (typeof LicenseClassEnum.enumValues)[number][];

    if (checked) {
      // Add the value if it's not already in the array
      if (!currentClasses.includes(value)) {
        currentClasses.push(value);
      }
    } else {
      // Remove the value if it's in the array
      const index = currentClasses.indexOf(value);
      if (index !== -1) {
        currentClasses.splice(index, 1);
      }
    }

    setValue('learningLicense.class', currentClasses);
    // Also update driving license classes to match
    setValue('drivingLicense.class', currentClasses);
  };

  return (
    <div>
      <div className="grid grid-cols-12 mb-6">
        <TypographyH5 className="col-span-3">License Classes</TypographyH5>
        <div className="grid grid-cols-3 col-span-9 gap-6 items-center">
          {LicenseClassEnum.enumValues.map((licenseClass) => (
            <div className="flex items-center space-x-2" key={licenseClass}>
              <Checkbox
                id={`license-class-${licenseClass}`}
                checked={selectedClasses.includes(licenseClass)}
                onCheckedChange={(checked) => handleClassToggle(licenseClass, checked as boolean)}
              />
              <label
                htmlFor={`license-class-${licenseClass}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {licenseClass}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Tabs defaultValue="learning" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="learning">Learning License</TabsTrigger>
          <TabsTrigger value="driving">Driving License</TabsTrigger>
        </TabsList>

        {/* Learning License Tab */}
        <TabsContent value="learning" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Learning License Details</CardTitle>
              <CardDescription>Enter your learning license information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={control}
                  name="learningLicense.licenseNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>License Number*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="License number"
                          value={field.value || ''}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="learningLicense.applicationNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Application Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Application number"
                          value={field.value || ''}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="learningLicense.testConductedOn"
                  render={() => (
                    <FormItem>
                      <FormLabel>Test Date</FormLabel>
                      <FormControl>
                        <DatePicker
                          name="learningLicense.testConductedOn"
                          control={control}
                          placeholderText="Select test date"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="learningLicense.issueDate"
                  render={() => (
                    <FormItem>
                      <FormLabel>Issue Date</FormLabel>
                      <FormControl>
                        <DatePicker
                          name="learningLicense.issueDate"
                          control={control}
                          placeholderText="Select issue date"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="learningLicense.expiryDate"
                  render={() => (
                    <FormItem>
                      <FormLabel>Expiry Date</FormLabel>
                      <FormControl>
                        <DatePicker
                          name="learningLicense.expiryDate"
                          control={control}
                          placeholderText="Select expiry date"
                          minDate={new Date('1900-01-01')}
                          maxDate={new Date(2100, 0, 1)} // Allow future dates for expiry
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Driving License Tab */}
        <TabsContent value="driving" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Driving License Details</CardTitle>
              <CardDescription>Enter your driving license information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={control}
                  name="drivingLicense.licenseNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>License Number*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="License number"
                          value={field.value || ''}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="drivingLicense.applicationNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Application Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Application number"
                          value={field.value || ''}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="drivingLicense.appointmentDate"
                  render={() => (
                    <FormItem>
                      <FormLabel>Appointment Date</FormLabel>
                      <FormControl>
                        <DatePicker
                          name="drivingLicense.appointmentDate"
                          control={control}
                          placeholderText="Select appointment date"
                          maxDate={new Date(2100, 0, 1)} // Allow future dates for appointments
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="drivingLicense.issueDate"
                  render={() => (
                    <FormItem>
                      <FormLabel>Issue Date</FormLabel>
                      <FormControl>
                        <DatePicker
                          name="drivingLicense.issueDate"
                          control={control}
                          placeholderText="Select issue date"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="drivingLicense.expiryDate"
                  render={() => (
                    <FormItem>
                      <FormLabel>Expiry Date</FormLabel>
                      <FormControl>
                        <DatePicker
                          name="drivingLicense.expiryDate"
                          control={control}
                          placeholderText="Select expiry date"
                          minDate={new Date('1900-01-01')}
                          maxDate={new Date(2100, 0, 1)} // Allow future dates for expiry
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="drivingLicense.testConductedBy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Test Conducted By</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Test conducted by"
                          value={field.value || ''}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="drivingLicense.imv"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>IMV</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="IMV"
                          value={field.value || ''}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="drivingLicense.rto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>RTO</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="RTO"
                          value={field.value || ''}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="drivingLicense.department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Department"
                          value={field.value || ''}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
