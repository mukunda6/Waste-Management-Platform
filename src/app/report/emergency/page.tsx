
'use client';

import { ReportIssueForm } from '@/components/report-issue-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';
import type { EmergencyCategory } from '@/lib/types';

const emergencyCategories: EmergencyCategory[] = [
    'Hazardous Waste Spillage',
    'Biomedical Waste Dumped',
    'Dead Animal',
    'Chemical Leak',
    'Major Garbage Fire',
];

export default function EmergencyReportPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/');
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }


  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-2xl font-headline flex items-center gap-2 text-destructive">
            <AlertTriangle />
            Report an Emergency Waste Issue
          </CardTitle>
          <CardDescription>
            This form is for critical waste-related hazards requiring immediate response. Your report will be escalated with the highest priority.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ReportIssueForm 
            user={user}
            isEmergency={true}
            allowedCategories={emergencyCategories}
            categoryTitle="Emergency Type"
            categoryPlaceholder="Select an emergency waste type"
          />
        </CardContent>
      </Card>
    </div>
  );
}
