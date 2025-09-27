

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
import { getAllUserScores } from '@/lib/firebase-service';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Gift, DollarSign, Star, TrendingUp, Zap, CheckCircle, Coins, ShoppingCart, Utensils, Droplets, GlassWater, Cookie, Milk, Package } from 'lucide-react';
import type { AppUser } from '@/lib/types';
import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useLanguage } from '@/hooks/use-language';
import { useAuth } from '@/hooks/use-auth';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

type UserStats = {
  uid: string;
  name: string;
  nameKey: string;
  avatarUrl: string;
  score: number;
};

const storeItems = [
    { name: 'Biscuit Packet', cost: 20, icon: <Cookie className="h-8 w-8 text-primary" />, imageHint: 'biscuit packet' },
    { name: 'Juice Box', cost: 25, icon: <GlassWater className="h-8 w-8 text-primary" />, imageHint: 'juice box' },
    { name: 'Soap Bar', cost: 30, icon: <Package className="h-8 w-8 text-primary" />, imageHint: 'soap bar' },
    { name: 'Bread Loaf', cost: 40, icon: <Utensils className="h-8 w-8 text-primary" />, imageHint: 'bread loaf' },
    { name: 'Detergent (500g)', cost: 50, icon: <Gift className="h-8 w-8 text-primary" />, imageHint: 'detergent box' },
    { name: 'Milk Packet (1L)', cost: 60, icon: <Milk className="h-8 w-8 text-primary" />, imageHint: 'milk packet' },
    { name: 'Cooking Oil (1L)', cost: 120, icon: <Droplets className="h-8 w-8 text-primary" />, imageHint: 'oil bottle' },
    { name: 'Rice Packet (1kg)', cost: 150, icon: <Utensils className="h-8 w-8 text-primary" />, imageHint: 'rice bag' },
];


export default function UserLeaderboardPage() {
  const [userStats, setUserStats] = useState<UserStats[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();
  const { user } = useAuth();

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      setLoading(true);
      try {
        const users = await getAllUserScores();
        
        const stats = users.map(u => ({
            uid: u.uid,
            name: u.name,
            nameKey: u.nameKey,
            avatarUrl: u.avatarUrl || `https://picsum.photos/seed/${u.name.split(' ')[0]}/100/100`,
            score: u.score || 0,
        })).sort((a,b) => b.score - a.score);
        
        setUserStats(stats);

      } catch (error) {
        console.error("Error fetching user leaderboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaderboardData();
  }, []);

  const getRankNumber = (rank: number) => {
    if (rank === 0) return <Trophy className="h-6 w-6 text-yellow-500" />;
    if (rank === 1) return <Trophy className="h-6 w-6 text-slate-400" />;
    if (rank === 2) return <Trophy className="h-6 w-6 text-amber-700" />;
    return (
      <span className="flex h-6 w-6 items-center justify-center text-sm font-bold text-muted-foreground">
        {rank + 1}
      </span>
    );
  };

  if (loading) {
    return <div>{t('loading_leaderboard')}</div>;
  }
  
  const currentUserScore = user?.score || 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                <CardTitle className="text-3xl font-headline flex items-center gap-2">
                    <Trophy className="h-8 w-8 text-primary" />
                    {t('leaderboard_rewards')}
                </CardTitle>
                <CardDescription>
                    {t('user_leaderboard_desc')}
                </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">{t('rank')}</TableHead>
                            <TableHead>{t('citizen')}</TableHead>
                            <TableHead className="text-right">{t('score')}</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {userStats.map((stat, index) => (
                            <TableRow key={stat.uid} className={index < 3 ? 'bg-muted/50 font-bold' : ''}>
                            <TableCell>
                                <div className="flex items-center justify-center">
                                    {getRankNumber(index)}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-4">
                                <Avatar>
                                    <AvatarImage src={stat.avatarUrl} />
                                    <AvatarFallback>
                                    {t(stat.nameKey).charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{t(stat.nameKey)}</p>
                                </div>
                                </div>
                            </TableCell>
                            <TableCell className="text-right text-lg font-bold text-primary">
                                {stat.score}
                            </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Coins className="text-yellow-500" /> Your Balance</CardTitle>
                </CardHeader>
                 <CardContent>
                    <p className="text-4xl font-bold text-primary">{currentUserScore}</p>
                    <p className="text-muted-foreground">coins available to redeem</p>
                 </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><TrendingUp /> How It Works</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 text-sm">
                   <div className="flex items-start gap-3">
                        <Star className="h-5 w-5 mt-1 text-primary flex-shrink-0"/>
                        <div>
                            <h4 className="font-semibold">{t('base_points')}</h4>
                            <p className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: t('base_points_desc') }} />
                        </div>
                   </div>
                    <div className="flex items-start gap-3">
                        <Zap className="h-5 w-5 mt-1 text-yellow-500 flex-shrink-0"/>
                        <div>
                            <h4 className="font-semibold">{t('emergency_bonus')}</h4>
                            <p className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: t('emergency_bonus_desc') }} />
                        </div>
                   </div>
                    <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 mt-1 text-green-500 flex-shrink-0"/>
                        <div>
                            <h4 className="font-semibold">{t('resolution_bonus')}</h4>
                            <p className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: t('resolution_bonus_desc') }} />
                        </div>
                   </div>
                </CardContent>
            </Card>
        </div>
      </div>
      
       <Card>
        <CardHeader>
            <CardTitle className="text-2xl font-headline flex items-center gap-2">
                <ShoppingCart className="h-7 w-7 text-primary" />
                Community Store
            </CardTitle>
            <CardDescription>
                Redeem your earned coins for daily necessities and rewards.
            </CardDescription>
        </CardHeader>
        <CardContent>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {storeItems.map(item => (
                <Card key={item.name}>
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <div className="p-4 bg-muted rounded-full mb-4">
                            {item.icon}
                        </div>
                        <h3 className="font-semibold text-md">{item.name}</h3>
                        <div className="flex items-center gap-1.5 font-bold text-lg my-2">
                            <Coins className="h-5 w-5 text-yellow-500"/>
                            {item.cost}
                        </div>
                         <Button className="w-full" disabled={currentUserScore < item.cost}>Redeem</Button>
                    </CardContent>
                </Card>
             ))}
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
