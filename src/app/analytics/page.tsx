
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getIssues, getWorkers } from '@/lib/firebase-service';
import type { Issue } from '@/lib/types';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Bar, BarChart, CartesianGrid, Legend, Pie, PieChart, Cell, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { useLanguage } from '@/hooks/use-language';


type CityData = {
    city: string;
    submitted: number;
    inProgress: number;
    resolved: number;
}

type CategoryData = {
    name: string;
    count: number;
}

const chartConfig = {
  submitted: {
    label: "Submitted",
    color: "hsl(var(--chart-1))",
  },
  inProgress: {
    label: "In Progress",
    color: "hsl(var(--chart-2))",
  },
  resolved: {
    label: "Resolved",
    color: "hsl(var(--chart-3))",
  },
  count: {
    label: 'Count',
    color: 'hsl(var(--chart-1))',
  },
};

export default function AnalyticsPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedIssues = await getIssues();
        setIssues(fetchedIssues);
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
  
  const cityData: CityData[] = issues.reduce((acc, issue) => {
    const city = issue.city || 'Unknown';
    let cityEntry = acc.find(c => c.city === city);
    if(!cityEntry) {
        cityEntry = { city, submitted: 0, inProgress: 0, resolved: 0 };
        acc.push(cityEntry);
    }
    if(issue.status === 'Submitted') cityEntry.submitted++;
    if(issue.status === 'In Progress') cityEntry.inProgress++;
    if(issue.status === 'Resolved') cityEntry.resolved++;

    return acc;
  }, [] as CityData[]);

  const statusDistribution = issues.reduce((acc, issue) => {
    acc[issue.status] = (acc[issue.status] || 0) + 1;
    return acc;
  }, {} as Record<Issue['status'], number>);

  const pieChartData = Object.entries(statusDistribution).map(([name, value]) => ({ name, value }));

  const categoryData: CategoryData[] = issues.reduce((acc, issue) => {
    let categoryEntry = acc.find(c => c.name === issue.category);
    if (!categoryEntry) {
        categoryEntry = { name: issue.category, count: 0 };
        acc.push(categoryEntry);
    }
    categoryEntry.count++;
    return acc;
  }, [] as CategoryData[]).sort((a,b) => b.count - a.count);


  if (loading) {
    return <div>Loading analytics dashboard...</div>
  }

  return (
    <div className="grid gap-8">
      <CardHeader className="px-0">
        <CardTitle>System-Wide Analytics</CardTitle>
        <CardDescription>High-level metrics for all civic issues across all regions.</CardDescription>
      </CardHeader>
      
      <div className="grid gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Issue Status by Zone</CardTitle>
                <CardDescription>Breakdown of issue statuses in each city zone.</CardDescription>
            </CardHeader>
            <CardContent>
                 <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                     <BarChart data={cityData} accessibilityLayer>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="city" tickLine={false} tickMargin={10} axisLine={false} />
                        <YAxis />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="submitted" stackId="a" fill="var(--color-submitted)" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="inProgress" stackId="a" fill="var(--color-inProgress)" />
                        <Bar dataKey="resolved" stackId="a" fill="var(--color-resolved)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle>Overall Issue Status</CardTitle>
                <CardDescription>Distribution of all issues by their current status.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                    <PieChart>
                        <Tooltip content={<ChartTooltipContent hideLabel />} />
                        <Legend />
                        <Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90}>
                             {pieChartData.map((entry, index) => {
                                const key = entry.name.replace(/\s+/g, '').toLowerCase() as keyof typeof chartConfig;
                                const colorKey = chartConfig[key]?.color;
                                return <Cell key={`cell-${index}`} fill={colorKey || '#8884d8'} />
                             })}
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
      </div>

       <Card>
            <CardHeader>
                <CardTitle>Issue Breakdown by Category</CardTitle>
                <CardDescription>Frequency of each issue type reported across the system.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="min-h-[400px] w-full">
                    <BarChart data={categoryData} layout="vertical" accessibilityLayer margin={{left: 100}}>
                        <CartesianGrid horizontal={false} />
                        <YAxis 
                            dataKey="name" 
                            type="category"
                            tickLine={false}
                            axisLine={false}
                        />
                        <XAxis type="number" hide />
                        <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} content={<ChartTooltipContent />} />
                        <Bar dataKey="count" fill="var(--color-count)" radius={4} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    </div>
  )
}
