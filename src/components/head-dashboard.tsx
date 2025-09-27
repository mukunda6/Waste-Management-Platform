

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
import { BarChart, LineChart, Line, Legend, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Map, Recycle, TrendingUp, Atom, Leaf, Fuel, Percent, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

type WasteProduct = {
  name: string;
  value: number; // Potential tons
  sold: number; // Sold tons
  fill: string;
};

type WasteStreamData = {
  type: string;
  totalTons: number;
  potential: WasteProduct[];
  revenueStreams: string[];
  icon: React.ReactNode;
}

const wasteStreams: WasteStreamData[] = [
    {
        type: 'Wet Waste',
        totalTons: 1250,
        icon: <Leaf className="h-6 w-6 text-green-500" />,
        potential: [
            { name: 'Compost', value: 750, sold: 600, fill: 'var(--color-compost)' },
            { name: 'Biogas', value: 400, sold: 400, fill: 'var(--color-biogas)' },
            { name: 'Animal Feed', value: 100, sold: 50, fill: 'var(--color-animalFeed)' },
        ],
        revenueStreams: ['Sell to Farmers', 'Power Generation', 'Livestock Farms'],
    },
    {
        type: 'Dry Waste',
        totalTons: 800,
        icon: <Recycle className="h-6 w-6 text-blue-500" />,
        potential: [
            { name: 'Recycled Plastic', value: 400, sold: 320, fill: 'var(--color-plastic)' },
            { name: 'Paper/Cardboard', value: 250, sold: 150, fill: 'var(--color-paper)' },
            { name: 'Metal & Glass', value: 150, sold: 150, fill: 'var(--color-metal)' },
        ],
        revenueStreams: ['Recycling Plants', 'Paper Mills', 'Scrap Dealers'],
    },
    {
        type: 'Hazardous Waste',
        totalTons: 50,
        icon: <Atom className="h-6 w-6 text-red-500" />,
        potential: [
            { name: 'Energy Recovery', value: 35, sold: 30, fill: 'var(--color-energy)' },
            { name: 'Safely Disposed', value: 15, sold: 15, fill: 'var(--color-disposed)' },
        ],
        revenueStreams: ['Waste-to-Energy Plants', 'Secure Landfills'],
    },
];

const wasteChartConfig = {
    value: { label: 'Potential', color: 'hsl(var(--chart-2))' },
    sold: { label: 'Sold', color: 'hsl(var(--chart-1))' },
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
const dailyWasteData = { collected: 450, processed: 380, TPD: 450 }; // in Tons


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
        <div className="grid gap-8 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Percent /> Segregation Compliance by Zone</CardTitle>
                    <CardDescription>Percentage of households following segregation rules.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={{}} className="h-64 w-full">
                        <BarChart data={cityData} accessibilityLayer>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="city" tickLine={false} tickMargin={10} axisLine={false} />
                             <YAxis stroke="hsl(var(--primary))" name="Segregation" unit="%"/>
                            <Tooltip cursor={{fill: 'hsl(var(--muted))'}} content={<ChartTooltipContent />} />
                            <Bar dataKey="segregationRate" fill="hsl(var(--primary))" name="Segregation %" radius={4}>
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
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Fuel/> Waste Stream Analytics: From Trash to Treasure</CardTitle>
                <CardDescription>Analysis of collected waste, its potential for generating valuable resources, and sales performance.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-8 md:grid-cols-1 lg:grid-cols-3">
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
                            <ChartContainer config={wasteChartConfig} className="h-48 w-full">
                                <BarChart data={stream.potential} layout="vertical" margin={{left: 20}}>
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" hide/>
                                    <Tooltip cursor={{fill: 'hsl(var(--muted))'}} content={<ChartTooltipContent />} />
                                    <Legend />
                                    <Bar dataKey="value" name="Potential" fill="var(--color-value)" radius={4} />
                                    <Bar dataKey="sold" name="Sold" fill="var(--color-sold)" radius={4} />
                                </BarChart>
                             </ChartContainer>
                             <div className="mt-4">
                                <p className="font-semibold text-sm mb-2">Sales & Output Analysis:</p>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Product</TableHead>
                                            <TableHead className="text-right">Sold / Potential (T)</TableHead>
                                            <TableHead className="text-right">% Sold</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {stream.potential.map(p => (
                                            <TableRow key={p.name}>
                                                <TableCell className="font-medium">{p.name}</TableCell>
                                                <TableCell className="text-right">{p.sold} / {p.value}</TableCell>
                                                <TableCell className="text-right font-bold text-primary">{((p.sold / p.value) * 100).toFixed(0)}%</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
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
    </div>
  )
}

    

    