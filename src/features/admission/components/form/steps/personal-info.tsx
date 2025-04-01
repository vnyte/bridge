'use client';

import { useFormContext, useWatch } from 'react-hook-form';
import { AdmissionFormValues } from '@/features/admission/types';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/ui/date-picker';
import { BloodGroupEnum, GenderEnum, CitizenStatusEnum } from '@/db/schema/client/columns';
import { TypographyH5, TypographyP } from '@/components/ui/typography';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useEffect } from 'react';
import { Info } from 'lucide-react';

export const PersonalInfoStep = () => {
  const { control, setValue } = useFormContext<AdmissionFormValues>();

  // Watch for changes in the checkbox and address fields
  const isSameAddress = useWatch({
    control,
    name: 'personalInfo.isCurrentAddressSameAsPermanentAddress',
  });

  const currentAddress = useWatch({
    control,
    name: 'personalInfo.address',
  });

  const currentCity = useWatch({
    control,
    name: 'personalInfo.city',
  });

  const currentState = useWatch({
    control,
    name: 'personalInfo.state',
  });

  const currentCountry = useWatch({
    control,
    name: 'personalInfo.country',
  });

  const currentPincode = useWatch({
    control,
    name: 'personalInfo.pincode',
  });

  // Update permanent address fields when checkbox is checked or current address fields change
  useEffect(() => {
    if (isSameAddress) {
      setValue('personalInfo.permanentAddress', currentAddress);
      setValue('personalInfo.permanentCity', currentCity);
      setValue('personalInfo.permanentState', currentState);
      setValue('personalInfo.permanentCountry', currentCountry);
      setValue('personalInfo.permanentPincode', currentPincode);
    }
  }, [
    isSameAddress,
    currentAddress,
    currentCity,
    currentState,
    currentCountry,
    currentPincode,
    setValue,
  ]);

  return (
    <div className="space-y-10">
      {/* Basic Information */}
      <div className="grid grid-cols-12">
        <TypographyH5 className="col-span-3">Personal Details</TypographyH5>

        <div className="grid grid-cols-3 col-span-9 gap-6 items-end">
          <FormField
            control={control}
            name="personalInfo.firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="First" value={field.value || ''} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="personalInfo.middleName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Middle" value={field.value || ''} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="personalInfo.lastName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Last" value={field.value || ''} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="personalInfo.guardianFirstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Guardian Name</FormLabel>
                <FormControl>
                  <Input placeholder="First" value={field.value || ''} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="personalInfo.guardianMiddleName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Middle" value={field.value || ''} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="personalInfo.guardianLastName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Last" value={field.value || ''} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="personalInfo.birthDate"
            render={() => (
              <FormItem>
                <FormLabel required>Date of Birth</FormLabel>
                <FormControl>
                  <DatePicker
                    name="personalInfo.birthDate"
                    control={control}
                    placeholderText="Select date of birth"
                    maxDate={new Date()}
                    minDate={new Date('1900-01-01')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="personalInfo.bloodGroup"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Blood Group</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {BloodGroupEnum.enumValues.map((bloodGroup) => (
                      <SelectItem key={bloodGroup} value={bloodGroup}>
                        {bloodGroup}
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
            name="personalInfo.gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Gender</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {GenderEnum.enumValues.map((gender) => (
                      <SelectItem key={gender} value={gender}>
                        {gender.charAt(0) + gender.slice(1).toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-12 pb-10">
        <TypographyH5 className="col-span-3">Contact Details</TypographyH5>
        <div className="grid grid-cols-3 col-span-9 gap-6 items-end">
          <FormField
            control={control}
            name="personalInfo.phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Phone Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Phone number"
                    value={field.value || ''}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormDescription className="flex gap-1">
                  <Info className="size-5 text-primary" /> This number will be used for updates,
                  receipts, and reminders
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="personalInfo.alternativePhoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alternative Phone</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Alternative phone"
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
            name="personalInfo.email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Email address"
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

      <div className="grid grid-cols-12">
        <TypographyH5 className="col-span-3">Address</TypographyH5>
        <div className="grid grid-cols-3 col-span-9 gap-6 items-end">
          <FormField
            control={control}
            name="personalInfo.address"
            render={({ field }) => (
              <FormItem className="col-span-3">
                <FormLabel required>Full Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Address"
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
            name="personalInfo.city"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>City</FormLabel>
                <FormControl>
                  <Input placeholder="City" value={field.value || ''} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="personalInfo.state"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>State</FormLabel>
                <FormControl>
                  <Input placeholder="State" value={field.value || ''} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="personalInfo.pincode"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Pincode</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Pincode"
                    value={field.value || ''}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <TypographyP className="col-span-3">Permanent Address</TypographyP>

          <FormField
            control={control}
            name="personalInfo.isCurrentAddressSameAsPermanentAddress"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 col-span-3">
                <FormControl>
                  <Checkbox checked={field.value === true} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Same as current Address</FormLabel>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="personalInfo.permanentAddress"
            render={({ field }) => (
              <FormItem className="col-span-3">
                <FormLabel required>Full Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Permanent address"
                    value={field.value || ''}
                    onChange={field.onChange}
                    disabled={isSameAddress === true}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="personalInfo.permanentCity"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>City</FormLabel>
                <FormControl>
                  <Input
                    placeholder="City"
                    value={field.value || ''}
                    onChange={field.onChange}
                    disabled={isSameAddress === true}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="personalInfo.permanentState"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>State</FormLabel>
                <FormControl>
                  <Input
                    placeholder="State"
                    value={field.value || ''}
                    onChange={field.onChange}
                    disabled={isSameAddress === true}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="personalInfo.permanentPincode"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Pincode</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Pincode"
                    value={field.value || ''}
                    onChange={field.onChange}
                    disabled={isSameAddress === true}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-12 align-center">
        <TypographyH5 className="col-span-3">Citizenship</TypographyH5>
        <div className="grid grid-cols-3 col-span-9 gap-6 items-end">
          <FormField
            control={control}
            name="personalInfo.citizenStatus"
            render={({ field }) => (
              <FormItem className="col-span-3">
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value || 'BIRTH'}
                    className="flex space-y-1"
                  >
                    {CitizenStatusEnum.enumValues.map((status) => (
                      <FormItem key={status} className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={status} />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {status.charAt(0) + status.slice(1).toLowerCase()}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoStep;
