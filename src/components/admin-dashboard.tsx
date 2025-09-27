

'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { getIssues, getWorkers, updateIssueAssignment } from '@/lib/firebase-service';
import type { Issue, Worker, SlaStatus } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ListChecks, Users, AlertTriangle, Clock, Map, Trash2, Percent } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/use-language';
import { Bar, BarChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltipContent } from './ui/chart';


const slaStatusColors: Record<SlaStatus, string> = {
  'On Time': 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700',
  'At Risk': 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-700',
  'Deadline Missed': 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/50 dark:text-red-300 dark:border-red-700',
  'Extended': 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-700',
  'Escalated': 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/50 dark:text-purple-300 dark:border-purple-700',
};


export function AdminDashboard() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { t } = useLanguage();

  const fetchData = async () => {
      try {
        const [fetchedIssues, fetchedWorkers] = await Promise.all([getIssues(), getWorkers()]);
        setIssues(fetchedIssues.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()));
        setWorkers(fetchedWorkers);
      } catch (error) {
        console.error("Error fetching admin data:", error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not fetch dashboard data.'
        });
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchData();
  }, []);

  const emergencyIssues = issues.filter(issue => issue.isEmergency && issue.status !== 'Resolved');
  const normalOpenIssues = issues.filter(issue => !issue.isEmergency && issue.status !== 'Resolved');
  const unassignedIssues = issues.filter(issue => issue.status !== 'Resolved' && !issue.assignedTo);
  const openIssues = issues.filter(issue => issue.status !== 'Resolved');

  const handleAssignWorker = async (issueId: string, workerId: string) => {
    try {
      await updateIssueAssignment(issueId, workerId);
      fetchData();
      toast({
        title: 'Worker Assigned',
        description: 'The waste collection task has been assigned and the worker notified.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Assignment Failed',
        description: 'Could not assign worker. Please try again.',
      });
    }
  };
  
  const getWorkerName = (workerId?: string) => {
    if (!workerId) return 'Unassigned';
    const worker = workers.find(w => w.id === workerId);
    return worker ? t(worker.nameKey) : 'Unknown Worker';
  };

  // Mock analytics data
  const segregationData = [
    { name: 'Zone A', compliance: 85 },
    { name: 'Zone B', compliance: 72 },
    { name: 'Zone C', compliance: 91 },
    { name: 'Zone D', compliance: 65 },
  ];
  const dailyWasteData = { collected: 450, processed: 380, TPD: 450 }; // in Tons


  if (loading) {
    return <div>Loading admin dashboard...</div>
  }

  return (
    <div className="grid gap-8">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
             <ListChecks className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openIssues.length}</div>
             <p className="text-xs text-muted-foreground">Total active waste complaints.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unassigned Tasks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unassignedIssues.length}</div>
            <p className="text-xs text-muted-foreground">Complaints needing worker assignment.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Workers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workers.length}</div>
             <p className="text-xs text-muted-foreground">Waste collection staff on duty.</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Facilities</CardTitle>
            <Map className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
             <p className="text-xs text-muted-foreground">Plants, recycling & scrap centers.</p>
          </CardContent>
        </Card>
      </div>

       <div className="grid gap-8 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Percent /> Segregation Compliance Tracker</CardTitle>
                    <CardDescription>Percentage of households/buildings following segregation rules by zone.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={{}} className="h-64 w-full">
                        <BarChart data={segregationData} accessibilityLayer>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                            <Tooltip cursor={{fill: 'hsl(var(--muted))'}} content={<ChartTooltipContent />} />
                            <Bar dataKey="compliance" fill="hsl(var(--primary))" radius={4}>
                            </Bar>
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Trash2 /> Daily Waste Analytics</CardTitle>
                    <CardDescription>Overview of today's total waste collected and processed.</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-around items-center h-64">
                    <div className="text-center">
                        <p className="text-4xl font-bold">{dailyWasteData.TPD}</p>
                        <p className="text-muted-foreground">Tons Per Day (TPD)</p>
                    </div>
                    <div className="text-center">
                        <p className="text-4xl font-bold">{dailyWasteData.processed}</p>
                        <p className="text-muted-foreground">Tons Processed</p>
                    </div>
                </CardContent>
            </Card>
       </div>


       {emergencyIssues.length > 0 && (
        <Card className="border-destructive border-2">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2 text-destructive">
                        <AlertTriangle />
                        Emergency Waste Reports
                    </CardTitle>
                    <Badge variant="destructive">{emergencyIssues.length} Active</Badge>
                </div>
                <CardDescription>These high-priority hazards require immediate attention and assignment.</CardDescription>
            </CardHeader>
            <CardContent>
                <IssueTable issues={emergencyIssues} workers={workers} onAssign={handleAssignWorker} getWorkerName={getWorkerName} />
            </CardContent>
        </Card>
       )}


      <Card>
        <CardHeader>
          <CardTitle>Manage Waste Complaints</CardTitle>
          <CardDescription>
            Assign workers to unresolved standard waste complaints.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <IssueTable issues={normalOpenIssues} workers={workers} onAssign={handleAssignWorker} getWorkerName={getWorkerName} />
        </CardContent>
      </Card>
    </div>
  )
}


const IssueTable = ({ issues, workers, onAssign, getWorkerName }: { issues: Issue[], workers: Worker[], onAssign: (issueId: string, workerId: string) => void, getWorkerName: (workerId?: string) => string }) => {
    const { t } = useLanguage();
    return (
        <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Complaint</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>SLA Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="text-right">Assigned Worker</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {issues.map(issue => (
                <TableRow key={issue.id}>
                  <TableCell className="font-medium">
                      <Button variant="link" asChild className="p-0 h-auto">
                        <Link href={`/issues/${issue.id}`}>{issue.title}</Link>
                      </Button>
                  </TableCell>
                  <TableCell>
                    <Badge variant={issue.isEmergency ? "destructive" : "outline"}>{issue.category}</Badge>
                  </TableCell>
                   <TableCell>
                    <Badge variant="outline" className={cn(slaStatusColors[issue.slaStatus])}>
                      {issue.slaStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(issue.submittedAt), {
                      addSuffix: true,
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Select
                      value={issue.assignedTo || ''}
                      onValueChange={workerId =>
                        onAssign(issue.id, workerId)
                      }
                      disabled={!workers.length}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Assign worker...">
                          {getWorkerName(issue.assignedTo)}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {workers.map(worker => (
                          <SelectItem key={worker.id} value={worker.id}>
                            {t(worker.nameKey)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
    )
}
