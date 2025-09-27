

'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getIssuesByUser } from '@/lib/firebase-service';
import type { Issue, IssueCategory } from '@/lib/types';
import { IssueCard } from './issue-card';
import { FilePlus2, Clock, CheckCircle, AlertTriangle, Trash2, ShoppingCart, BookOpen, Recycle, Biohazard } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLanguage } from '@/hooks/use-language';
import { Progress } from './ui/progress';
import { useToast } from '@/hooks/use-toast';

const wasteCategories: { category: IssueCategory; icon: React.ReactNode; description: string; }[] = [
    { category: 'Overflowing Bins', icon: <Trash2 className="h-8 w-8" />, description: 'Public bin is full.'},
    { category: 'Illegal Dumping', icon: <Trash2 className="h-8 w-8" />, description: 'Waste dumped in public space.' },
    { category: 'Garbage Not Collected', icon: <Trash2 className="h-8 w-8" />, description: 'Home or street collection missed.' },
    { category: 'Non-segregation of Waste', icon: <Recycle className="h-8 w-8" />, description: 'Mixed waste not segregated.' },
];

export function CitizenDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [userIssues, setUserIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [highlightedIssueId, setHighlightedIssueId] = useState<string | null>(null);
  const [showAllReports, setShowAllReports] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const newIssueId = searchParams.get('newIssueId');
    if (newIssueId) {
      setHighlightedIssueId(newIssueId);
      router.replace('/dashboard', { scroll: false });
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (user) {
      const fetchIssues = async () => {
        setLoading(true);
        try {
          const issues = await getIssuesByUser(user.uid);
          setUserIssues(issues);
        } catch (error) {
          console.error("Error fetching user issues:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchIssues();
    }
  }, [user]);

  const handleCategoryClick = (category: IssueCategory) => {
    router.push(`/report?category=${encodeURIComponent(category)}`);
  };
  
  const handleLogWaste = (wasteType: string) => {
    toast({
        title: `${wasteType} Logged!`,
        description: `You've earned 5 compliance points. Keep it up!`,
    });
  }

  if (loading) {
    return <div>Loading your dashboard...</div>;
  }

  const submittedCount = userIssues.filter(i => i.status === 'Submitted').length;
  const inProgressCount = userIssues.filter(i => i.status === 'In Progress').length;
  const resolvedCount = userIssues.filter(i => i.status === 'Resolved').length;

  const displayedIssues = showAllReports ? userIssues : userIssues.slice(0, 3);


  return (
    <div className="grid gap-8">
       <Card>
         <CardHeader>
            <CardTitle>Waste Report Hub</CardTitle>
            <CardDescription>Report waste-related issues, log your disposal, or learn more about waste management.</CardDescription>
         </CardHeader>
         <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                 <Link
                    href="/report/emergency"
                    className="col-span-full md:col-span-1 lg:col-span-1 text-center p-4 rounded-lg border border-destructive bg-destructive/10 hover:bg-destructive/20 transition-all flex flex-col items-center justify-center shadow-sm"
                >
                    <div className="text-destructive mb-2"><AlertTriangle className="h-8 w-8" /></div>
                    <h3 className="font-semibold text-sm text-destructive">Emergency Waste Report</h3>
                    <p className="text-xs text-destructive/80 mt-1">For hazardous spills, biohazards, dead animals.</p>
                </Link>
                {wasteCategories.map(({ category, icon, description }) => (
                    <button
                        key={category}
                        onClick={() => handleCategoryClick(category)}
                        className="text-center p-4 rounded-lg border bg-card hover:bg-accent hover:text-accent-foreground transition-all flex flex-col items-center justify-center shadow-sm"
                    >
                        <div className="text-primary mb-2">{icon}</div>
                        <h3 className="font-semibold text-sm">{category}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{description}</p>
                    </button>
                ))}
            </div>
         </CardContent>
       </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader>
                    <CardTitle>3-Bin Waste Tracking</CardTitle>
                    <CardDescription>Log your daily segregated waste disposal to earn compliance points.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Dry Waste</span>
                        <Button size="sm" variant="outline" onClick={() => handleLogWaste('Dry Waste')}>Log</Button>
                    </div>
                     <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Wet Waste</span>
                        <Button size="sm" variant="outline" onClick={() => handleLogWaste('Wet Waste')}>Log</Button>
                    </div>
                     <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Hazardous Waste</span>
                        <Button size="sm" variant="destructive" onClick={() => handleLogWaste('Hazardous Waste')}>Log</Button>
                    </div>
                </CardContent>
            </Card>
            <Card className="flex flex-col">
                <CardHeader>
                    <CardTitle>Training Hub</CardTitle>
                    <CardDescription>Complete modules to become a "Green Champion".</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-center">
                     <div>
                        <div className="flex justify-between items-center mb-1">
                            <p className="text-sm font-medium">Your Progress</p>
                            <p className="text-sm font-bold">2 / 3 Modules</p>
                        </div>
                        <Progress value={66} />
                    </div>
                </CardContent>
                <div className="p-6 pt-0">
                    <Button className="w-full" asChild>
                        <Link href="/training"><BookOpen/>Go to Training</Link>
                    </Button>
                </div>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Compost Kit Shop</CardTitle>
                    <CardDescription>Use your coins to buy bins, compost kits, and more.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center h-full">
                    <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4"/>
                    <Button asChild>
                        <Link href="#"><ShoppingCart/>Browse Store</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('submitted_reports')}
            </CardTitle>
            <FilePlus2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{submittedCount}</div>
            <p className="text-xs text-muted-foreground">
              {t('issues_awaiting_review')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('in_progress')}</CardTitle>cv
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressCount}</div>
            <p className="text-xs text-muted-foreground">
              {t('issues_actively_worked_on')}
            </p>
          </CardContent>
        </card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('solved')}</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resolvedCount}</div>
            <p className="text-xs text-muted-foreground">
              {t('issues_solved')}
            </p>
          </CardContent>
        </Card>
      </div>

       {userIssues.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{t('my_recent_reports')}</CardTitle>
              {userIssues.length > 3 && (
                 <Button variant="outline" onClick={() => setShowAllReports(!showAllReports)}>
                    {showAllReports ? t('show_less') : t('view_all_reports')}
                </Button>
              )}
            </div>
            <CardDescription>
              {t('my_recent_reports_desc')}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            {displayedIssues.map(issue => (
                <IssueCard 
                    key={issue.id} 
                    issue={issue} 
                    isHighlighted={issue.id === highlightedIssueId}
                />
            ))}
          </CardContent>
        </Card>
       )}

    </div>
  );
}
