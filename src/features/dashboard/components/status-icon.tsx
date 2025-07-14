import { DocumentStatus } from '../types';

interface StatusIconProps {
  status: DocumentStatus;
  className?: string;
}

export const StatusIcon = ({ status, className = '' }: StatusIconProps) => {
  const isExpired = status === 'Expired';

  return (
    <div
      className={`w-4 h-4 flex items-center justify-center text-white text-xs font-bold ${
        isExpired ? 'bg-red-500' : 'bg-yellow-500'
      } ${className}`}
      style={{
        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
      }}
      aria-label={`Document status: ${status}`}
    />
  );
};
