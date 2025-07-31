'use client';

import { useState, useEffect, useMemo } from 'react';
import { Check, ChevronsUpDown, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  getRTOByPincode,
  searchRTOs,
  getAllRTOOffices,
  type RTOOfficeData,
} from '@/lib/constants/rto-offices';

interface RTOOfficeSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  // Optional: Auto-suggest based on user's pincode
  userPincode?: string;
}

export function RTOOfficeSelect({
  value,
  onValueChange,
  placeholder = 'Select RTO office',
  disabled = false,
  className,
  userPincode,
}: RTOOfficeSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestedRTO, setSuggestedRTO] = useState<RTOOfficeData | null>(null);

  // Auto-suggest RTO based on user's pincode
  useEffect(() => {
    if (userPincode && userPincode.length === 6) {
      const rto = getRTOByPincode(userPincode);
      if (rto) {
        setSuggestedRTO(rto);
        // Auto-select if no value is set
        if (!value) {
          onValueChange(rto.name);
        }
      }
    }
  }, [userPincode, value, onValueChange]);

  // Get filtered RTO offices based on search
  const filteredRTOs = useMemo(() => {
    if (searchTerm && searchTerm.length >= 2) {
      return searchRTOs(searchTerm);
    }
    return getAllRTOOffices();
  }, [searchTerm]);

  // Group RTOs by city for Maharashtra
  const groupedRTOs = useMemo(() => {
    const groups: Record<string, RTOOfficeData[]> = {};
    filteredRTOs.forEach((rto) => {
      if (!groups[rto.city]) {
        groups[rto.city] = [];
      }
      groups[rto.city].push(rto);
    });
    return groups;
  }, [filteredRTOs]);

  const selectedRTO = useMemo(() => {
    return getAllRTOOffices().find((rto) => rto.name === value);
  }, [value]);

  return (
    <div className={className}>
      {/* Suggested RTO based on pincode */}
      {suggestedRTO && suggestedRTO.name !== value && (
        <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center gap-2 text-sm text-blue-700">
            <MapPin className="h-4 w-4" />
            <span className="font-medium">Suggested for your area:</span>
          </div>
          <div className="mt-1 flex items-center justify-between">
            <div>
              <p className="font-medium text-blue-900">{suggestedRTO.name}</p>
              <p className="text-xs text-blue-600">
                {suggestedRTO.address}, {suggestedRTO.city}
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onValueChange(suggestedRTO.name)}
              className="text-blue-700 border-blue-300 hover:bg-blue-100"
            >
              Select
            </Button>
          </div>
        </div>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn('w-full justify-between', disabled && 'opacity-50')}
            disabled={disabled}
          >
            {selectedRTO ? (
              <div className="flex items-center gap-2 truncate">
                <span className="truncate">{selectedRTO.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {selectedRTO.code}
                </Badge>
              </div>
            ) : (
              placeholder
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <div className="flex items-center border-b px-3">
              <Input
                placeholder="Search by RTO code (MH43) or pincode (400001)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <CommandList>
              <CommandEmpty>
                <div className="py-6 text-center text-sm">
                  <MapPin className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p>No RTO offices found.</p>
                  {searchTerm && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Try entering RTO code (MH43) or pincode (400001)
                    </p>
                  )}
                </div>
              </CommandEmpty>

              {Object.entries(groupedRTOs).map(([city, rtos]) => (
                <CommandGroup key={city} heading={city}>
                  {rtos.map((rto) => (
                    <CommandItem
                      key={rto.code}
                      value={rto.name}
                      onSelect={(currentValue) => {
                        onValueChange(currentValue);
                        setOpen(false);
                      }}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          value === rto.name ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate">{rto.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {rto.code}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {rto.address}, {rto.city}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Serves: {rto.servesPincodes.slice(0, 3).join(', ')}
                          {rto.servesPincodes.length > 3 &&
                            ` +${rto.servesPincodes.length - 3} more`}
                        </p>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
