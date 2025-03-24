'use client';

import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { TypographyP } from '@/components/ui/typography';
import { useTransition } from 'react';
import { addVehicle } from '../server/action';
import { redirect } from 'next/navigation';
import { vehicleFormSchema } from '../schemas/vehicles';

export function VehicleForm() {
  const form = useForm<z.infer<typeof vehicleFormSchema>>({
    resolver: zodResolver(vehicleFormSchema),
  });

  const [isPending, startTransition] = useTransition();

  function onSubmit(values: z.infer<typeof vehicleFormSchema>) {
    startTransition(async () => {
      const { error, message } = await addVehicle(values);
      if (!error) {
        toast.success('Vehicle added successfully');
        form.reset();
        redirect('/vehicles');
      } else toast.error(message);
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-10">
        <div className="grid grid-cols-12 w-full">
          <TypographyP className="col-span-3 font-medium">Vehicle Details</TypographyP>
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
          <TypographyP className="col-span-3 font-medium">Documents</TypographyP>
          <div className="col-span-9 gap-6 flex">
            <FormField
              control={form.control}
              name="pucNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PUC Expiry</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter here" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="insuranceNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Insurance Expiry</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter here" type="text" {...field} />
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
                    <Input placeholder="Enter here" type="text" {...field} />
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
        <Button type="submit" isLoading={isPending}>
          Submit
        </Button>
      </form>
    </Form>
  );
}
