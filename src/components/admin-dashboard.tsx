

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
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ListChecks, Users, AlertTriangle, Clock, Map, Trash2, Percent, ShoppingBag, Truck, Check, X, CheckCircle, Fuel, Leaf, Recycle, Atom } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/use-language';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { ChartContainer, ChartTooltipContent } from './ui/chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';


const slaStatusColors: Record<SlaStatus, string> = {
  'On Time': 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700',
  'At Risk': 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-700',
  'Deadline Missed': 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/50 dark:text-red-300 dark:border-red-700',
  'Extended': 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-700',
  'Escalated': 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/50 dark:text-purple-300 dark:border-purple-700',
};


type BuyerOrder = {
  id: string;
  buyerName: string;
  product: string;
  quantity: number; // in tons
  location: string;
  orderDate: string;
  deadline: string;
  status: 'Pending Approval' | 'Approved' | 'In Transit' | 'Delivered' | 'Denied';
};

const mockBuyerOrders: BuyerOrder[] = [
    { id: 'order-001', buyerName: 'Recycle Corp.', product: 'PET/HDPE Pellets', quantity: 10, location: 'Jeedimetla Industrial Area', orderDate: '2024-07-28T10:00:00Z', deadline: '2024-08-05T17:00:00Z', status: 'Pending Approval' },
    { id: 'order-002', buyerName: 'GreenSoil Organics', product: 'Organic Compost', quantity: 25, location: 'Amberpet Farms', orderDate: '2024-07-27T14:30:00Z', deadline: '2024-08-10T17:00:00Z', status: 'Approved' },
    { id: 'order-003', buyerName: 'BuildStrong Bricks', product: 'Incineration Ash', quantity: 5, location: 'Patancheru', orderDate: '2024-07-26T11:00:00Z', deadline: '2024-08-01T17:00:00Z', status: 'In Transit' },
    { id: 'order-004', buyerName: 'National Paper Mill', product: 'Cardboard Bales', quantity: 15, location: 'Cherlapally', orderDate: '2024-07-20T09:00:00Z', deadline: '2024-07-28T17:00:00Z', status: 'Delivered' },
    { id: 'order-005', buyerName: 'Scrap Kings', product: 'Scrap Metal Mix', quantity: 8, location: 'Balanagar', orderDate: '2024-07-29T16:00:00Z', deadline: '2024-08-06T17:00:00Z', status: 'Pending Approval' },
];

const orderStatusConfig = {
    'Pending Approval': { color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="h-4 w-4" /> },
    'Approved': { color: 'bg-blue-100 text-blue-800', icon: <Check className="h-4 w-4" /> },
    'In Transit': { color: 'bg-purple-100 text-purple-800', icon: <Truck className="h-4 w-4" /> },
    'Delivered': { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="h-4 w-4" /> },
    'Denied': { color: 'bg-red-100 text-red-800', icon: <X className="h-4 w-4" /> },
};

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


export function AdminDashboard() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [orders, setOrders] = useState<BuyerOrder[]>(mockBuyerOrders);
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

   const handleOrderStatusChange = (orderId: string, newStatus: BuyerOrder['status']) => {
    setOrders(prevOrders => prevOrders.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
    toast({
        title: `Order ${newStatus}`,
        description: `The buyer order has been marked as ${newStatus.toLowerCase()}.`
    });
  };
  
  const getWorkerName = (workerId?: string) => {
    if (!workerId) return 'Unassigned';
    const worker = workers.find(w => w.id === workerId);
    return worker ? t(worker.nameKey) : 'Unknown Worker';
  };

  // Mock analytics data
  const segregationData = [
    { name: 'Charminar', compliance: 85 },
    { name: 'Kukatpally', compliance: 72 },
    { name: 'Serilingampally', compliance: 91 },
    { name: 'L.B. Nagar', compliance: 65 },
  ];
  const dailyWasteData = { collected: 450, processed: 380, TPD: 450 }; // in Tons


  if (loading) {
    return <div>Loading admin dashboard...</div>
  }

  return (
    <div className="grid gap-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.filter(o => o.status === 'Pending Approval').length}</div>
            <p className="text-xs text-muted-foreground">Buyer orders needing approval.</p>
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
            <CardTitle className="text-sm font-medium">Unassigned Tasks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unassignedIssues.length}</div>
            <p className="text-xs text-muted-foreground">Complaints needing worker assignment.</p>
          </CardContent>
        </Card>
      </div>

       <Tabs defaultValue="operations">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="operations">Operations Management</TabsTrigger>
                <TabsTrigger value="analytics">System-Wide Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="operations" className="space-y-8 mt-4">
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
                    <CardTitle>Manage Standard Complaints</CardTitle>
                    <CardDescription>
                        Assign workers to unresolved standard waste complaints.
                    </CardDescription>
                    </CardHeader>
                    <CardContent>
                    <IssueTable issues={normalOpenIssues} workers={workers} onAssign={handleAssignWorker} getWorkerName={getWorkerName} />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Buyer Order Management</CardTitle>
                        <CardDescription>Review, approve, and track orders for recycled materials from buyers.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order</TableHead>
                                    <TableHead>Buyer</TableHead>
                                    <TableHead>Delivery Location</TableHead>
                                    <TableHead>Time Left / Deadline</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.map(order => (
                                    <TableRow key={order.id}>
                                        <TableCell>
                                            <div className="font-medium">{order.product}</div>
                                            <div className="text-sm text-muted-foreground">{order.quantity} Tons</div>
                                        </TableCell>
                                        <TableCell>{order.buyerName}</TableCell>
                                        <TableCell>{order.location}</TableCell>
                                        <TableCell>
                                            <div className="font-medium">{formatDistanceToNow(parseISO(order.deadline), { addSuffix: true })}</div>
                                            <div className="text-sm text-muted-foreground">{format(parseISO(order.deadline), 'MMM d, yyyy')}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={cn('gap-2', orderStatusConfig[order.status].color)}>
                                                {orderStatusConfig[order.status].icon}
                                                {order.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {order.status === 'Pending Approval' && (
                                                <div className="flex gap-2 justify-end">
                                                    <Button size="sm" variant="outline" onClick={() => handleOrderStatusChange(order.id, 'Approved')}>
                                                        <Check className="h-4 w-4 mr-1"/> Approve
                                                    </Button>
                                                    <Button size="sm" variant="destructive" onClick={() => handleOrderStatusChange(order.id, 'Denied')}>
                                                        <X className="h-4 w-4 mr-1"/> Deny
                                                    </Button>
                                                </div>
                                            )}
                                            {(order.status === 'Approved' || order.status === 'In Transit') && (
                                                <Button size="sm" variant="outline" onClick={() => handleOrderStatusChange(order.id, order.status === 'Approved' ? 'In Transit' : 'Delivered')}>
                                                   {order.status === 'Approved' ? <Truck className="h-4 w-4 mr-1"/> : <CheckCircle className="h-4 w-4 mr-1"/>}
                                                    {order.status === 'Approved' ? 'Mark as Shipped' : 'Mark as Delivered'}
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                 </Card>
            </TabsContent>
             <TabsContent value="analytics" className="space-y-8 mt-4">
                 <div className="grid gap-8 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Percent /> Segregation Compliance by Zone</CardTitle>
                            <CardDescription>Percentage of households following waste segregation rules.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={{}} className="h-64 w-full">
                                <BarChart data={segregationData} accessibilityLayer>
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                                    <YAxis stroke="hsl(var(--primary))" name="Segregation" unit="%"/>
                                    <Tooltip cursor={{fill: 'hsl(var(--muted))'}} content={<ChartTooltipContent />} />
                                    <Bar dataKey="compliance" fill="hsl(var(--primary))" name="Compliance %" radius={4}>
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
                                <p className="text-4xl font-bold">{dailyWasteData.collected}</p>
                                <p className="text-muted-foreground">Tons Collected</p>
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
            </TabsContent>
       </Tabs>
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
