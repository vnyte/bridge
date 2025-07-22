'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { User } from 'lucide-react';
import { getClientsForForms } from '@/server/actions/forms';
import { Client } from '@/server/db/client';

interface ClientSelectorProps {
  selectedClient: string | null;
  onClientSelect: (clientId: string | null) => void;
}

export function ClientSelector({ selectedClient, onClientSelect }: ClientSelectorProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const clientData = await getClientsForForms();
        setClients(clientData);
      } catch (error) {
        console.error('Failed to fetch clients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const selectedClientData = clients.find((client) => client.id === selectedClient);

  //TODO: Make select client searchable.
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="h-5 w-5" />
          <span>Select Client</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Select
            value={selectedClient || ''}
            onValueChange={(value) => onClientSelect(value || null)}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={loading ? 'Loading clients...' : 'Choose a client to generate forms'}
              />
            </SelectTrigger>
            <SelectContent>
              {!loading && clients.length === 0 ? (
                <div className="p-2 text-sm text-muted-foreground text-center">
                  No clients found
                </div>
              ) : (
                clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    <div className="flex items-center space-x-2">
                      <span>
                        {client.firstName} {client.lastName}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {client.clientCode}
                      </Badge>
                    </div>
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>

          {selectedClientData && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-blue-900">
                    {selectedClientData.firstName} {selectedClientData.lastName}
                  </h4>
                  <p className="text-sm text-blue-700">{selectedClientData.phoneNumber}</p>
                </div>
                <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                  {selectedClientData.clientCode}
                </Badge>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
