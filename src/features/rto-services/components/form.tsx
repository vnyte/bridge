import { RTOServiceMultistepForm } from './form/multistep-form';
import { type RTOServiceWithClient } from '../types';

type RTOServiceFormProps = {
  rtoService?: RTOServiceWithClient;
  defaultRtoOffice?: string | null;
};

export function RTOServiceForm({ rtoService, defaultRtoOffice }: RTOServiceFormProps) {
  console.log('RTOServiceForm props:', { rtoService: !!rtoService, defaultRtoOffice });
  return <RTOServiceMultistepForm rtoService={rtoService} defaultRtoOffice={defaultRtoOffice} />;
}
