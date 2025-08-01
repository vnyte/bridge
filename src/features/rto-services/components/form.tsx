import { RTOServiceMultistepForm } from './form/multistep-form';
import { type RTOServiceWithClient } from '../types';

type RTOServiceFormProps = {
  rtoService?: RTOServiceWithClient;
  defaultRtoOffice?: string | null;
};

export function RTOServiceForm({ rtoService, defaultRtoOffice }: RTOServiceFormProps) {
  return <RTOServiceMultistepForm rtoService={rtoService} defaultRtoOffice={defaultRtoOffice} />;
}
