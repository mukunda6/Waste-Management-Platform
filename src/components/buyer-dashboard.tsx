
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Leaf, Recycle, Atom, ShoppingCart } from 'lucide-react';

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
        revenueStreams: ['Organic Fertilizer', 'Renewable Energy', 'Livestock Nutrition'],
    },
    {
        type: 'Dry Waste',
        totalTons: 800,
        icon: <Recycle className="h-6 w-6 text-blue-500" />,
        potential: [
            { name: 'Recycled Plastic (PET/HDPE)', value: 400, fill: 'var(--color-plastic)' },
            { name: 'Paper/Cardboard Bales', value: 250, fill: 'var(--color-paper)' },
            { name: 'Scrap Metal & Glass', value: 150, fill: 'var(--color-metal)' },
        ],
        revenueStreams: ['Plastic Pellets', 'Pulp for Paper Mills', 'Metal & Glass Recycling'],
    },
    {
        type: 'Hazardous Waste',
        totalTons: 50,
        icon: <Atom className="h-6 w-6 text-red-500" />,
        potential: [
            { name: 'Incineration Ash', value: 35, fill: 'var(--color-disposed)' },
            { name: 'Refuse-Derived Fuel (RDF)', value: 15, fill: 'var(--color-energy)' },
        ],
        revenueStreams: ['Waste-to-Energy', 'Construction Material'],
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


export function BuyerDashboard() {
  return (
    <div className="grid gap-8">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl font-headline"><ShoppingCart /> Waste Resource Marketplace</CardTitle>
                <CardDescription>Browse available processed waste materials for purchase. All quantities are estimates in tons per month.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-8 md:grid-cols-3">
                {wasteStreams.map(stream => (
                    <Card key={stream.type} className="flex flex-col">
                        <CardHeader className="pb-2">
                             <CardTitle className="flex items-center gap-2 text-lg">
                                {stream.icon}
                                {stream.type}
                             </CardTitle>
                             <p className="text-2xl font-bold">{stream.totalTons} <span className="text-sm font-normal text-muted-foreground">Tons/Month</span></p>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col justify-between">
                            <div>
                                 <ChartContainer config={wasteChartConfig} className="mx-auto aspect-square h-40">
                                    <PieChart>
                                        <Tooltip content={<ChartTooltipContent hideLabel />} />
                                        <Pie data={stream.potential} dataKey="value" nameKey="name" innerRadius={30} paddingAngle={5}>
                                            {stream.potential.map((entry) => (
                                                <Cell key={entry.name} fill={entry.fill} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                 </ChartContainer>
                                 <div className="mt-4">
                                    <p className="font-semibold text-sm mb-2">Available Products:</p>
                                    <ul className="space-y-1 text-sm text-muted-foreground">
                                        {stream.potential.map(p => (
                                            <li key={p.name} className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full" style={{backgroundColor: p.fill}}/>
                                                {p.name}: <span className="font-medium text-foreground">{p.value} Tons</span>
                                            </li>
                                        ))}
                                    </ul>
                                 </div>
                             </div>
                             <Button className="w-full mt-6">Place Inquiry</Button>
                        </CardContent>
                    </Card>
                ))}
            </CardContent>
        </Card>
    </div>
  )
}
