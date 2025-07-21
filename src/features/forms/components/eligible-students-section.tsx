'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Download, Printer, Users, Calendar, CheckCircle2 } from 'lucide-react';
import {
  getEligibleStudentsForPermanentLicense,
  getFormPrintStats,
  markFormsAsPrinted,
  getBulkClientDataForForms,
} from '@/server/actions/forms';
import { generateBulkPDFs, type FormData } from '@/lib/pdf-generator';
import { toast } from 'sonner';

type FilterType = 'new-only' | 'all-eligible' | 'recently-printed';

type EligibleStudent = Awaited<ReturnType<typeof getEligibleStudentsForPermanentLicense>>[0];

type Stats = Awaited<ReturnType<typeof getFormPrintStats>>;

export function EligibleStudentsSection() {
  const [students, setStudents] = useState<EligibleStudent[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<FilterType>('new-only');
  const [skipPrinted, setSkipPrinted] = useState(true);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [studentsData, statsData] = await Promise.all([
        getEligibleStudentsForPermanentLicense(filter),
        getFormPrintStats(),
      ]);
      setStudents(studentsData);
      setStats(statsData);
      setSelectedStudents(new Set()); // Clear selection when filter changes
    } catch (error) {
      toast.error('Failed to load eligible students');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSelectAll = () => {
    const selectableStudents = students.filter((student) => !skipPrinted || !student.isPrinted);
    setSelectedStudents(new Set(selectableStudents.map((s) => s.id)));
  };

  const handleClearSelection = () => {
    setSelectedStudents(new Set());
  };

  const handleStudentToggle = (studentId: string, checked: boolean) => {
    const newSelection = new Set(selectedStudents);
    if (checked) {
      newSelection.add(studentId);
    } else {
      newSelection.delete(studentId);
    }
    setSelectedStudents(newSelection);
  };

  const handleMarkAsPrinted = async () => {
    if (selectedStudents.size === 0) {
      toast.error('Please select students to mark as printed');
      return;
    }

    setProcessing(true);
    try {
      await markFormsAsPrinted(Array.from(selectedStudents), 'form-4');
      toast.success(`Marked ${selectedStudents.size} forms as printed`);
      await loadData(); // Refresh data
    } catch (error) {
      toast.error('Failed to mark forms as printed');
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  const handleBulkDownload = async () => {
    if (selectedStudents.size === 0) {
      toast.error('Please select students to download forms');
      return;
    }

    setProcessing(true);
    try {
      const clientIds = Array.from(selectedStudents);
      toast.info(`Generating PDFs for ${clientIds.length} students...`);

      // Fetch detailed client data for selected students
      const clientsData = await getBulkClientDataForForms(clientIds);

      if (clientsData.length === 0) {
        toast.error('No client data found for selected students');
        return;
      }

      // Convert to FormData format
      const formsData: FormData[] = clientsData.map((client) => ({
        id: client.id,
        firstName: client.firstName,
        middleName: client.middleName,
        lastName: client.lastName,
        clientCode: client.clientCode,
        phoneNumber: client.phoneNumber,
        email: client.email,
        aadhaarNumber: client.aadhaarNumber,
        panNumber: client.panNumber,
        birthDate: client.birthDate,
        bloodGroup: client.bloodGroup,
        gender: client.gender,
        address: client.address,
        city: client.city,
        state: client.state,
        pincode: client.pincode,
        guardianFirstName: client.guardianFirstName,
        guardianMiddleName: client.guardianMiddleName,
        guardianLastName: client.guardianLastName,
        photoUrl: client.photoUrl,
        signatureUrl: client.signatureUrl,
        learningLicenseNumber: client.learningLicenseNumber,
        learningLicenseIssueDate: client.learningLicenseIssueDate,
        learningLicenseExpiryDate: client.learningLicenseExpiryDate,
        learningLicenseClass: client.learningLicenseClass,
      }));

      // Generate and download bulk PDFs
      const timestamp = new Date().toISOString().split('T')[0];
      await generateBulkPDFs(formsData, {
        filename: `Form4_Bulk_${timestamp}_${formsData.length}students`,
        quality: 0.9,
      });

      toast.success(`Successfully generated ${formsData.length} Form 4 PDFs!`);

      // Optionally mark as printed after successful generation
      // await markFormsAsPrinted(clientIds, 'form-4');
      // await loadData();
    } catch (error) {
      console.error('Bulk PDF generation failed:', error);
      toast.error('Failed to generate PDFs. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const getSelectableCount = () => {
    return students.filter((student) => !skipPrinted || !student.isPrinted).length;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Eligible Students for Permanent License
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading eligible students...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Eligible Students for Permanent License
        </CardTitle>
        {stats && (
          <div className="flex gap-2 text-sm text-muted-foreground">
            <Badge variant="outline" className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {stats.totalEligible} eligible
            </Badge>
            <Badge variant="default" className="flex items-center gap-1">
              🆕 {stats.newEligible} new
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              {stats.alreadyPrinted} printed
            </Badge>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters and Controls */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Select value={filter} onValueChange={(value: FilterType) => setFilter(value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new-only">🆕 New Only</SelectItem>
                <SelectItem value="all-eligible">📋 All Eligible</SelectItem>
                <SelectItem value="recently-printed">🕒 Recently Printed</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="skip-printed"
                checked={skipPrinted}
                onCheckedChange={(checked) => setSkipPrinted(!!checked)}
              />
              <label htmlFor="skip-printed" className="text-sm">
                Skip Printed
              </label>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              disabled={getSelectableCount() === 0}
            >
              Select All ({getSelectableCount()})
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearSelection}
              disabled={selectedStudents.size === 0}
            >
              Clear Selection
            </Button>
          </div>
        </div>

        {/* Students List */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {students.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No students found for the selected filter
            </div>
          ) : (
            students.map((student) => {
              const isSelectable = !skipPrinted || !student.isPrinted;
              const isSelected = selectedStudents.has(student.id);

              return (
                <div
                  key={student.id}
                  className={`flex items-center justify-between p-3 border rounded-lg ${
                    student.isPrinted ? 'bg-muted/50' : 'bg-background'
                  } ${!isSelectable ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => handleStudentToggle(student.id, !!checked)}
                      disabled={!isSelectable}
                    />
                    <div>
                      <div className="font-medium">
                        {student.firstName} {student.lastName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {student.clientCode} • {student.phoneNumber}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {student.daysSinceLearningLicense} days
                    </Badge>

                    {student.isPrinted ? (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Printed {student.daysSincePrint}d ago
                      </Badge>
                    ) : (
                      <Badge className="flex items-center gap-1">🆕 New</Badge>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Action Buttons */}
        {selectedStudents.size > 0 && (
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              {selectedStudents.size} student{selectedStudents.size !== 1 ? 's' : ''} selected
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleBulkDownload}
                disabled={processing}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                {processing ? 'Generating PDFs...' : 'Download Selected'}
              </Button>

              <Button
                onClick={handleMarkAsPrinted}
                disabled={processing}
                className="flex items-center gap-2"
              >
                <Printer className="h-4 w-4" />
                {processing ? 'Marking...' : 'Mark as Printed'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
