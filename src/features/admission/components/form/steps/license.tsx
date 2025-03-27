'use client';

import { useFormContext } from 'react-hook-form';
import { AdmissionFormValues } from '@/features/admission/types';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { LicenseTypeEnum } from '@/db/schema/enums';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const LicenseStep = () => {
  const { control } = useFormContext<AdmissionFormValues>();

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">License Information</h2>

      <Tabs defaultValue="learning" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="learning">Learning License</TabsTrigger>
          <TabsTrigger value="driving">Driving License</TabsTrigger>
        </TabsList>

        {/* Learning License Tab */}
        <TabsContent value="learning" className="mt-6">
          <div className="rounded-lg border p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Learning License Details</h3>
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
                name="learningLicense.type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>License Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select license type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {LicenseTypeEnum.enumValues.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
          </div>
        </TabsContent>

        {/* Driving License Tab */}
        <TabsContent value="driving" className="mt-6">
          <div className="rounded-lg border p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Driving License Details</h3>
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
                name="drivingLicense.type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>License Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select license type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {LicenseTypeEnum.enumValues.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
