
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
import { Leaf, Recycle, Atom, ShoppingCart, MapPin, Clock, DollarSign, Truck, CheckCircle, X, ListOrdered } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow, parseISO } from 'date-fns';


type ProductData = {
    name: string;
    value: number;
    fill: string;
    pricePerTon: number;
}

type WasteStreamData = {
  type: string;
  totalTons: number;
  icon: React.ReactNode;
  potential: ProductData[];
  location: string;
  leadTime: string;
}

const wasteStreams: WasteStreamData[] = [
    {
        type: 'Wet Waste',
        totalTons: 1250,
        icon: <Leaf className="h-6 w-6 text-green-500" />,
        location: 'Amberpet Composting Plant',
        leadTime: '10-15 Days',
        potential: [
            { name: 'Organic Compost', value: 750, fill: 'var(--color-compost)', pricePerTon: 50 },
            { name: 'Biogas Feedstock', value: 400, fill: 'var(--color-biogas)', pricePerTon: 20 },
            { name: 'Animal Feed Base', value: 100, fill: 'var(--color-animalFeed)', pricePerTon: 35 },
        ],
    },
    {
        type: 'Dry Waste',
        totalTons: 800,
        icon: <Recycle className="h-6 w-6 text-blue-500" />,
        location: 'Jeedimetla Recycling Hub',
        leadTime: '5-7 Days',
        potential: [
            { name: 'PET/HDPE Pellets', value: 400, fill: 'var(--color-plastic)', pricePerTon: 200 },
            { name: 'Cardboard Bales', value: 250, fill: 'var(--color-paper)', pricePerTon: 80 },
            { name: 'Scrap Metal Mix', value: 150, fill: 'var(--color-metal)', pricePerTon: 150 },
        ],
    },
    {
        type: 'Hazardous Waste',
        totalTons: 50,
        icon: <Atom className="h-6 w-6 text-red-500" />,
        location: 'Dundigal W2E Facility',
        leadTime: 'On-Demand',
        potential: [
            { name: 'Refuse-Derived Fuel (RDF)', value: 35, fill: 'var(--color-energy)', pricePerTon: 40 },
            { name: 'Incineration Ash (for bricks)', value: 15, fill: 'var(--color-disposed)', pricePerTon: 15 },
        ],
    },
];

type MyOrder = {
  id: string;
  product: string;
  quantity: number; // in tons
  orderDate: string;
  deliveryDate: string;
  status: 'Pending Approval' | 'Approved' | 'In Transit' | 'Delivered' | 'Denied';
};

const myOrders: MyOrder[] = [
    { id: 'order-002', product: 'Organic Compost', quantity: 25, orderDate: '2024-07-27T14:30:00Z', deliveryDate: '2024-08-10T17:00:00Z', status: 'Approved' },
    { id: 'order-003', product: 'Incineration Ash', quantity: 5, orderDate: '2024-07-26T11:00:00Z', deliveryDate: '2024-08-01T17:00:00Z', status: 'In Transit' },
    { id: 'order-004', product: 'Cardboard Bales', quantity: 15, orderDate: '2024-07-20T09:00:00Z', deliveryDate: '2024-07-28T17:00:00Z', status: 'Delivered' },
];

const orderStatusConfig = {
    'Pending Approval': { color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="h-4 w-4" /> },
    'Approved': { color: 'bg-blue-100 text-blue-800', icon: <CheckCircle className="h-4 w-4" /> },
    'In Transit': { color: 'bg-purple-100 text-purple-800', icon: <Truck className="h-4 w-4" /> },
    'Delivered': { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="h-4 w-4" /> },
    'Denied': { color: 'bg-red-100 text-red-800', icon: <X className="h-4 w-4" /> },
};


export function BuyerDashboard() {
  return (
    <div className="grid gap-8">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl font-headline"><ShoppingCart /> Waste Resource Marketplace</CardTitle>
                <CardDescription>Browse available processed waste materials for purchase. All quantities are estimated monthly outputs.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-8 md:grid-cols-1 lg:grid-cols-3">
                {wasteStreams.map(stream => (
                    <Card key={stream.type} className="flex flex-col">
                        <CardHeader className="pb-2">
                             <CardTitle className="flex items-center gap-2 text-lg">
                                {stream.icon}
                                {stream.type}
                             </CardTitle>
                             <p className="text-2xl font-bold">{stream.totalTons} <span className="text-sm font-normal text-muted-foreground">Tons/Month (Total Input)</span></p>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col justify-between">
                            <div>
                                <div className="text-sm text-muted-foreground space-y-2 mb-4">
                                     <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4"/>
                                        <span>Facility: <strong>{stream.location}</strong></span>
                                     </div>
                                      <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4"/>
                                        <span>Est. Lead Time: <strong>{stream.leadTime}</strong></span>
                                     </div>
                                </div>
                                
                                <p className="font-semibold text-sm mb-2">Available Products (Estimated Monthly Output):</p>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Product</TableHead>
                                            <TableHead className="text-center">Qty (Tons)</TableHead>
                                            <TableHead className="text-right">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {stream.potential.map(p => (
                                            <TableRow key={p.name}>
                                                <TableCell className="font-medium flex items-center gap-2">
                                                    <div className="h-2 w-2 rounded-full" style={{backgroundColor: p.fill}}/>
                                                    <div>
                                                        <p>{p.name}</p>
                                                        <p className="text-xs text-muted-foreground">${p.pricePerTon}/Ton</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">{p.value}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button size="sm">
                                                        <ShoppingCart className="h-4 w-4 mr-2"/>
                                                        Order
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                             </div>
                        </CardContent>
                    </Card>
                ))}
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl font-headline"><ListOrdered /> My Order History & Tracking</CardTitle>
                <CardDescription>Monitor the status and delivery timeline of your recent purchases.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead>Est. Delivery / Delivered On</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {myOrders.map(order => (
                            <TableRow key={order.id}>
                                <TableCell className="font-mono text-sm">{order.id}</TableCell>
                                <TableCell>
                                    <div className="font-medium">{order.product}</div>
                                    <div className="text-sm text-muted-foreground">{order.quantity} Tons</div>
                                </TableCell>
                                <TableCell>
                                    <div className="font-medium">
                                        {order.status === 'Delivered' 
                                            ? format(parseISO(order.deliveryDate), 'MMM d, yyyy')
                                            : formatDistanceToNow(parseISO(order.deliveryDate), { addSuffix: true })
                                        }
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {order.status !== 'Delivered' && format(parseISO(order.deliveryDate), 'MMM d, yyyy')}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={cn('gap-2 font-semibold', orderStatusConfig[order.status].color)}>
                                        {orderStatusConfig[order.status].icon}
                                        {order.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  )
}
