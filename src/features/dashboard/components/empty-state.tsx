import { TypographyH4, TypographyP, TypographySmall } from '@/components/ui/typography';
import Image from 'next/image';
import Link from 'next/link';

export const EmptyState = () => {
  return (
    <div className="flex flex-col justify-center items-center text-center gap-4">
      <Link href="/admission">
        <Image src="/add.svg" alt="Add" width={132} height={120} />
      </Link>
      <TypographyH4>Welcome!</TypographyH4>
      <div>
        <TypographyP className="text-gray-500 font-bold">No client data added yet!</TypographyP>
        <TypographySmall className="mt-0 text-gray-700">
          Add your first client to get started.
        </TypographySmall>
      </div>
    </div>
  );
};
