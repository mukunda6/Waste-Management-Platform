

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { CivicSolveLogo } from './icons';
import {
  LayoutDashboard,
  FilePlus2,
  Settings,
  CircleHelp,
  Trophy,
  Users,
  Shield,
  Bot,
  AlertTriangle,
  BarChart,
  GraduationCap
} from 'lucide-react';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useAuth } from '@/hooks/use-auth';
import { useIsMobile } from '@/hooks/use-mobile';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/hooks/use-language';

export function AppSidebar() {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <Sidebar className="border-r bg-sidebar text-sidebar-foreground dark:bg-card dark:text-foreground">
      <SidebarHeader className="p-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold font-headline text-lg">
          <CivicSolveLogo className="h-8 w-8 text-primary" />
          <span>Waste Mgmt</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="p-4 flex flex-col justify-between">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/dashboard'}
              tooltip={t('dashboard')}
            >
              <Link href="/dashboard">
                <LayoutDashboard />
                <span>{t('dashboard')}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
           {user?.role === 'Citizen' && (
            <>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/user-leaderboard'}
                  tooltip={t('leaderboard_rewards')}
                >
                  <Link href="/user-leaderboard">
                    <Trophy />
                    <span>{t('leaderboard_rewards')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/training'}
                  tooltip={'Training'}
                >
                  <Link href="/training">
                    <GraduationCap />
                    <span>{'Training Hub'}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
            )}
             {(user?.role === 'Admin' || user?.role === 'Head') && (
            <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/analytics'}
                  tooltip={'Analytics'}
                >
                  <Link href="/analytics">
                    <BarChart />
                    <span>{'Analytics'}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
        </SidebarMenu>

        
      </SidebarContent>
    </Sidebar>
  );
}
