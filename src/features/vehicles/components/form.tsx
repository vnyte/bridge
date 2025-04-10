'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTransition } from 'react';
import { toast } from 'sonner';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TypographyP } from '@/components/ui/typography';

import { addVehicle } from '../server/action';
import { vehicleFormSchema } from '../schemas/vehicles';
import { Vehicle } from '@/server/db/vehicle';
import { DatePicker } from '@/components/ui/date-picker';
import { formatDateToYYYYMMDD, parseYYYYMMDDToDate } from '@/lib/utils/date';
import { useRouter } from 'next/navigation';

export function VehicleForm({ vehicle }: { vehicle?: Vehicle }) {
  const form = useForm<z.infer<typeof vehicleFormSchema>>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      name: vehicle?.name || '',
      number: vehicle?.number || '',
      pucExpiry: vehicle?.pucExpiry,
      insuranceExpiry: vehicle?.insuranceExpiry,
      registrationExpiry: vehicle?.registrationExpiry,
      rent: vehicle?.rent || 0,
    },
  });

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function onSubmit(values: z.infer<typeof vehicleFormSchema>) {
    startTransition(async () => {
      try {
        const result = await addVehicle(values, vehicle?.id);

        if (result && 'error' in result && result.error) {
          toast.error(result.message || 'Failed to add vehicle');
        } else {
          toast.success(result.message);
          if (!vehicle?.id) {
            form.reset();
            router.push('/vehicles');
          }
        }
      } catch (error) {
        console.log(error);
        toast.error('Something went wrong');
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-12 w-full">
          <TypographyP className="col-span-3 font-medium">Basic Details</TypographyP>

          <div className="col-span-9 gap-6 flex">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter here" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter here" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-12 w-full">
          <TypographyP className="col-span-3 font-medium">Expiry Details</TypographyP>

          <div className="col-span-9 gap-6 flex">
            <FormField
              control={form.control}
              name="pucExpiry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PUC Expiry</FormLabel>
                  <FormControl>
                    <DatePicker
                      selected={parseYYYYMMDDToDate(field.value)}
                      onChange={(date) => field.onChange(formatDateToYYYYMMDD(date))}
                      placeholderText="Select expiry date"
                      maxDate={new Date(2100, 0, 1)}
                      disabled={undefined}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="insuranceExpiry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Insurance Expiry</FormLabel>
                  <FormControl>
                    <DatePicker
                      selected={parseYYYYMMDDToDate(field.value)}
                      onChange={(date) => field.onChange(formatDateToYYYYMMDD(date))}
                      placeholderText="Select expiry date"
                      maxDate={new Date(2100, 0, 1)}
                      disabled={undefined}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="registrationExpiry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Registration Expiry</FormLabel>
                  <FormControl>
                    <DatePicker
                      selected={parseYYYYMMDDToDate(field.value)}
                      onChange={(date) => field.onChange(formatDateToYYYYMMDD(date))}
                      placeholderText="Select expiry date"
                      maxDate={new Date(2100, 0, 1)}
                      disabled={undefined}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-12 w-full">
          <TypographyP className="col-span-3 font-medium">Price Details</TypographyP>

          <div className="col-span-3">
            <FormField
              control={form.control}
              name="rent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rent per 30 mins</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter here"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type="submit" disabled={isPending}>
          {isPending ? 'Submitting...' : 'Submit'}
        </Button>
      </form>
    </Form>
  );
}
