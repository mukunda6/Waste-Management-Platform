

'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getIssues } from '@/lib/firebase-service';
import type { Issue } from '@/lib/types';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { BarChart, PieChart, LineChart, Line, Legend, Bar, XAxis, YAxis, Tooltip, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Users, Map, Recycle, TrendingUp } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

type CityData = {
    city: string;
    segregationRate: number;
    landfillLoad: number;
}

type FacilityData = {
    name: string;
    usage: number;
}

const cityData: CityData[] = [
    { city: 'Zone A', segregationRate: 85, landfillLoad: 1200 },
    { city: 'Zone B', segregationRate: 72, landfillLoad: 1500 },
    { city: 'Zone C', segregationRate: 91, landfillLoad: 950 },
    { city: 'Zone D', segregationRate: 65, landfillLoad: 1800 },
];

const facilityData: FacilityData[] = [
    { name: 'Bio-Plant 1', usage: 78 },
    { name: 'W-to-E Plant', usage: 92 },
    { name: 'Recycling Center A', usage: 65 },
    { name: 'Scrap Shop Hub', usage: 88 },
];

const greenChampions = [
    { name: 'Green Enclave Apartments', type: 'Bulk Generator', compliance: 98 },
    { name: 'Commerce Street Assn.', type: 'Commercial Area', compliance: 92 },
    { name: 'Ward 15 Committee', type: 'Ward', compliance: 85 },
];


export function HeadDashboard() {
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getIssues();
      } catch (error) {
        console.error("Error fetching head data:", error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not fetch dashboard data.'
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [toast]);
  

  if (loading) {
    return <div>Loading City-Wide Analytics Dashboard...</div>
  }

  return (
    <div className="grid gap-8">
      
      <div className="grid gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Map/> City-Wide Waste Analytics</CardTitle>
                <CardDescription>Segregation rates and landfill load across different regions/zones.</CardDescription>
            </CardHeader>
            <CardContent>
                 <ChartContainer config={{}} className="min-h-[300px] w-full">
                     <BarChart data={cityData} accessibilityLayer>
                        <XAxis dataKey="city" tickLine={false} tickMargin={10} axisLine={false} />
                        <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--primary))" />
                        <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--destructive))" />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar yAxisId="left" dataKey="segregationRate" fill="hsl(var(--primary))" name="Segregation %" radius={[4, 4, 0, 0]} />
                        <Line yAxisId="right" dataKey="landfillLoad" type="monotone" stroke="hsl(var(--destructive))" name="Landfill Load (Tons)" strokeWidth={2} dot={false} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Recycle/> Facility Usage</CardTitle>
                <CardDescription>Current utilization of waste processing facilities.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={{}} className="min-h-[300px] w-full">
                    <PieChart>
                        <Tooltip content={<ChartTooltipContent hideLabel />} />
                        <Pie data={facilityData} dataKey="usage" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90}>
                             {facilityData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${index + 1}))`} />
                            ))}
                        </Pie>
                        <Legend />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
      </div>

       <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Users/> Green Champions Panel</CardTitle>
                <CardDescription>Tracking local monitoring committees (bulk generators, commercial areas, wards).</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Committee / Group</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className="text-right">Compliance Rate</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {greenChampions.map(champion => (
                            <TableRow key={champion.name}>
                                <TableCell className="font-medium">{champion.name}</TableCell>
                                <TableCell>{champion.type}</TableCell>
                                <TableCell className="text-right font-bold text-primary">{champion.compliance}%</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><TrendingUp/> Policy Feedback & Reports</CardTitle>
                <CardDescription>Generate reports on compliance, hotspots, and campaign effectiveness.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Report generation feature coming soon. This section will allow exporting data on segregation hotspots, overall compliance trends, and the impact of awareness campaigns to inform policy decisions.</p>
            </CardContent>
        </Card>
    </div>
  )
}
