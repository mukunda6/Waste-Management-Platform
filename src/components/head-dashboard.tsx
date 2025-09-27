

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
import { BarChart, PieChart, LineChart, Line, Legend, Bar, XAxis, YAxis, Tooltip, Pie, Cell, ResponsiveContainer, DonutChart } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Users, Map, Recycle, TrendingUp, Atom, Leaf, Fuel } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

type WasteStreamData = {
  type: string;
  totalTons: number;
  potential: {
    name: string;
    value: number;
    fill: string;
  }[];
  revenueStreams: string[];
  icon: React.ReactNode;
}

const wasteStreams: WasteStreamData[] = [
    {
        type: 'Wet Waste',
        totalTons: 1250,
        icon: <Leaf className="h-6 w-6 text-green-500" />,
        potential: [
            { name: 'Compost', value: 750, fill: 'var(--color-compost)' },
            { name: 'Biogas', value: 400, fill: 'var(--color-biogas)' },
            { name: 'Animal Feed', value: 100, fill: 'var(--color-animalFeed)' },
        ],
        revenueStreams: ['Sell to Farmers', 'Power Generation', 'Livestock Farms'],
    },
    {
        type: 'Dry Waste',
        totalTons: 800,
        icon: <Recycle className="h-6 w-6 text-blue-500" />,
        potential: [
            { name: 'Recycled Plastic', value: 400, fill: 'var(--color-plastic)' },
            { name: 'Paper/Cardboard', value: 250, fill: 'var(--color-paper)' },
            { name: 'Metal & Glass', value: 150, fill: 'var(--color-metal)' },
        ],
        revenueStreams: ['Recycling Plants', 'Paper Mills', 'Scrap Dealers'],
    },
    {
        type: 'Hazardous Waste',
        totalTons: 50,
        icon: <Atom className="h-6 w-6 text-red-500" />,
        potential: [
            { name: 'Safely Disposed', value: 35, fill: 'var(--color-disposed)' },
            { name: 'Energy Recovery', value: 15, fill: 'var(--color-energy)' },
        ],
        revenueStreams: ['Waste-to-Energy Plants', 'Secure Landfills'],
    },
];

const wasteChartConfig = {
    compost: { label: 'Compost', color: 'hsl(var(--chart-1))' },
    biogas: { label: 'Biogas', color: 'hsl(var(--chart-2))' },
    animalFeed: { label: 'Animal Feed', color: 'hsl(var(--chart-3))' },
    plastic: { label: 'Plastic', color: 'hsl(var(--chart-1))' },
    paper: { label: 'Paper', color: 'hsl(var(--chart-2))' },
    metal: { label: 'Metal/Glass', color: 'hsl(var(--chart-3))' },
    disposed: { label: 'Disposed', color: 'hsl(var(--chart-1))' },
    energy: { label: 'Energy', color: 'hsl(var(--chart-2))' },
};


const cityData = [
    { city: 'Zone A', segregationRate: 85, landfillLoad: 1200 },
    { city: 'Zone B', segregationRate: 72, landfillLoad: 1500 },
    { city: 'Zone C', segregationRate: 91, landfillLoad: 950 },
    { city: 'Zone D', segregationRate: 65, landfillLoad: 1800 },
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
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Fuel/> Waste Stream Analytics: From Trash to Treasure</CardTitle>
                <CardDescription>Analysis of collected waste and its potential for generating valuable resources and revenue.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-8 md:grid-cols-3">
                {wasteStreams.map(stream => (
                    <Card key={stream.type}>
                        <CardHeader className="pb-2">
                             <CardTitle className="flex items-center gap-2 text-lg">
                                {stream.icon}
                                {stream.type}
                             </CardTitle>
                             <p className="text-2xl font-bold">{stream.totalTons} <span className="text-sm font-normal text-muted-foreground">Tons/Month</span></p>
                        </CardHeader>
                        <CardContent>
                             <ChartContainer config={wasteChartConfig} className="mx-auto aspect-square h-48">
                                <DonutChart>
                                    <Tooltip content={<ChartTooltipContent hideLabel />} />
                                    <Pie data={stream.potential} dataKey="value" nameKey="name" innerRadius={40}>
                                        {stream.potential.map((entry) => (
                                            <Cell key={entry.name} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                </DonutChart>
                             </ChartContainer>
                             <div className="mt-4">
                                <p className="font-semibold text-sm mb-2">Potential Outputs:</p>
                                <ul className="space-y-1 text-sm text-muted-foreground">
                                    {stream.potential.map(p => (
                                        <li key={p.name} className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full" style={{backgroundColor: p.fill}}/>
                                            {p.name}: <span className="font-medium text-foreground">{p.value} Tons</span>
                                        </li>
                                    ))}
                                </ul>
                             </div>
                             <div className="mt-4">
                                <p className="font-semibold text-sm mb-2">Revenue Channels:</p>
                                <div className="flex flex-wrap gap-2">
                                    {stream.revenueStreams.map(r => (
                                        <div key={r} className="text-xs bg-muted px-2 py-1 rounded-full">{r}</div>
                                    ))}
                                </div>
                             </div>
                        </CardContent>
                    </Card>
                ))}
            </CardContent>
        </Card>
      
      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Map/> City-Wide Segregation & Landfill Load</CardTitle>
                <CardDescription>Comparison of waste segregation rates and landfill load across different zones.</CardDescription>
            </CardHeader>
            <CardContent>
                 <ChartContainer config={{}} className="min-h-[300px] w-full">
                     <BarChart data={cityData} accessibilityLayer>
                        <XAxis dataKey="city" tickLine={false} tickMargin={10} axisLine={false} />
                        <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--primary))" name="Segregation" unit="%"/>
                        <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--destructive))" name="Landfill" unit="T" />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar yAxisId="left" dataKey="segregationRate" fill="hsl(var(--primary))" name="Segregation %" radius={[4, 4, 0, 0]} />
                        <Line yAxisId="right" dataKey="landfillLoad" type="monotone" stroke="hsl(var(--destructive))" name="Landfill Load (Tons)" strokeWidth={2} dot={{r: 4}} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><TrendingUp/> Policy & Campaign Effectiveness</CardTitle>
                <CardDescription>Generate reports on compliance, hotspots, and campaign effectiveness.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Report generation feature coming soon. This section will allow exporting data on segregation hotspots, overall compliance trends, and the impact of awareness campaigns to inform policy decisions.</p>
            </CardContent>
        </Card>
      </div>

    </div>
  )
}
