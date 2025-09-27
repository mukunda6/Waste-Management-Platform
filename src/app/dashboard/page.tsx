

'use client'

import { useSearchParams } from 'next/navigation'
import type { UserRole } from '@/lib/types'
import { CitizenDashboard } from '@/components/citizen-dashboard'
import { AdminDashboard } from '@/components/admin-dashboard'
import { WorkerDashboard } from '@/components/worker-dashboard';
import { BuyerDashboard } from '@/components/buyer-dashboard';
import { Suspense, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'


function DashboardContent() {
  const router = useRouter();
  const { user, loading } = useAuth();
  
  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);


  // While loading or if user is null (before redirect happens), show a loading screen.
  if (loading || !user) {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="text-lg">Loading Dashboard...</div>
        </div>
    )
  }

  const renderDashboard = () => {
    switch (user.role) {
      case 'Citizen':
        return <CitizenDashboard />
      case 'Admin':
        return <AdminDashboard />
      case 'Worker':
        return <WorkerDashboard user={user}/>
      case 'Buyer':
        return <BuyerDashboard />
      default:
        // Fallback to citizen dashboard if role is unknown
        return <CitizenDashboard />
    }
  }

  const getDashboardDescription = () => {
    switch (user.role) {
      case 'Citizen':
        return 'Manage your waste segregation, report issues, and track your green score.'
      case 'Admin':
        return 'Monitor compliance, assign tasks, manage waste facilities, and view city-wide analytics.'
      case 'Worker':
        return 'View and manage your assigned waste collection tasks.'
      case 'Buyer':
        return 'Browse and purchase available waste-derived resources.'
      default:
        return 'Track your reports and see community issues.'
    }
  }
  
  const getRoleTitle = () => {
     switch (user.role) {
      case 'Citizen':
        return 'Citizen Waste Dashboard';
      case 'Admin':
        return 'Waste Management Admin';
       case 'Worker':
        return 'Waste Worker Dashboard';
      case 'Buyer':
        return 'Waste Resource Marketplace';
      default:
        return 'Dashboard';
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            {getRoleTitle()}
          </h1>
          <p className="text-muted-foreground mt-1">
            {getDashboardDescription()}
          </p>
        </div>
      </div>

      {renderDashboard()}
    </div>
  )
}


export default function DashboardPage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center h-screen"><div className="text-lg">Loading...</div></div>}>
            <DashboardContent />
        </Suspense>
    )
}
