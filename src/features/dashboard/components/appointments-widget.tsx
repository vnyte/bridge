import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';

type AppointmentType = {
  id: string;
  title: string;
  count: number;
  type: 'learning' | 'final' | 'rto';
};

const appointments: AppointmentType[] = [
  {
    id: '1',
    title: 'Learning Test',
    count: 12,
    type: 'learning',
  },
  {
    id: '2',
    title: 'Final Test',
    count: 23,
    type: 'final',
  },
  {
    id: '3',
    title: 'R.T.O. Work',
    count: 6,
    type: 'rto',
  },
];

export function AppointmentsWidget() {
  return (
    <Card className="relative">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center space-x-2">
          <div className="bg-pink-50 rounded-full w-8 h-8 flex items-center justify-center">
            <CalendarIcon className="h-5 w-5 text-muted-foreground" />
          </div>
          <CardTitle className="text-base font-medium">
            Upcoming Appointments & Test Schedules
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-6 bg-gray-50 py-4 px-6">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="space-y-4 border-r-1 last:border-r-0">
              <h3 className="text-sm font-medium text-muted-foreground">{appointment.title}</h3>
              <div className="text-4xl font-bold text-foreground">{appointment.count}</div>
              <Button
                variant="link"
                className="text-blue-600 hover:text-blue-700 p-0 h-auto font-normal text-sm"
              >
                View
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
