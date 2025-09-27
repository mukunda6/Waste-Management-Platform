
'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { CivicSolveLogo } from '@/components/icons'
import { useToast } from '@/hooks/use-toast'
import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import OtpInput from 'react-otp-input';

const emailLoginFormSchema = z.object({
  email: z.string().email('Please enter a valid email.'),
  password: z.string().min(1, 'Password is required.'),
});

const mobileLoginFormSchema = z.object({
  mobile: z.string().regex(/^\d{10}$/, 'Please enter a valid 10-digit mobile number.'),
});

const otpSchema = z.object({
    otp: z.string().min(6, 'OTP must be 6 digits.'),
});


type Role = 'Citizen' | 'Admin' | 'Head';

const roleCredentials: Record<Role, { email: string; description: string }> = {
    Citizen: {
        email: 'citizen@test.com',
        description: 'Track waste segregation, report issues, and earn rewards.'
    },
    Admin: {
        email: 'admin@test.com',
        description: 'Manage waste collection, monitor compliance, and assign tasks.'
    },
    Head: {
        email: 'head@test.com',
        description: 'Oversee city-wide waste analytics and policy effectiveness.'
    }
}

export default function LoginPage() {
  const router = useRouter()
  const { user, login, loginWithOtp, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  const emailForm = useForm<z.infer<typeof emailLoginFormSchema>>({
    resolver: zodResolver(emailLoginFormSchema),
    defaultValues: {
      email: roleCredentials.Citizen.email,
      password: 'password',
    },
  })

  const mobileForm = useForm<z.infer<typeof mobileLoginFormSchema>>({
    resolver: zodResolver(mobileLoginFormSchema),
    defaultValues: {
      mobile: '9876543210',
    },
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
  });

  const [loginStep, setLoginStep] = useState<'mobileInput' | 'otpInput'>('mobileInput');
  const [mobileNumber, setMobileNumber] = useState('');

  async function onEmailSubmit(values: z.infer<typeof emailLoginFormSchema>) {
    setIsSubmitting(true);
    try {
      await login(values.email, values.password);
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.message || 'An unexpected error occurred. Please use one of the demo accounts.',
      })
    } finally {
        setIsSubmitting(false);
    }
  }

  async function onMobileSubmit(values: z.infer<typeof mobileLoginFormSchema>) {
      setIsSubmitting(true);
      // In a real app, you'd call an API to send an OTP here.
      // For this demo, we'll just move to the OTP step.
      setMobileNumber(values.mobile);
      setLoginStep('otpInput');
      toast({
          title: 'OTP Sent',
          description: 'A mock OTP has been sent. Please use 123456 to log in.',
      });
      setIsSubmitting(false);
  }

  async function onOtpSubmit(values: z.infer<typeof otpSchema>) {
      setIsSubmitting(true);
      try {
          await loginWithOtp(mobileNumber, values.otp);
          router.push('/dashboard');
      } catch (error: any) {
          toast({
              variant: 'destructive',
              title: 'Login Failed',
              description: error.message || 'The OTP is incorrect. Please try again.',
          });
      } finally {
          setIsSubmitting(false);
      }
  }


  const handleTabChange = (role: Role) => {
    emailForm.setValue('email', roleCredentials[role].email);
    emailForm.setValue('password', 'password');
  }

  // Display a loading indicator until auth state is confirmed and user is not logged in.
  if (authLoading || user) {
     return (
        <div className="flex justify-center items-center h-screen">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    )
  }

  const EmailLoginForm = ({ role }: { role: Role }) => (
    <Form {...emailForm}>
      <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
        <FormField
          control={emailForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your email"
                  {...field}
                  autoComplete="email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={emailForm.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  {...field}
                  autoComplete="current-password"
                />
              </FormControl>
               <FormMessage />
            </FormItem>
          )}
        />
        <div className="pt-2">
            <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isSubmitting}
            >
                {isSubmitting && <Loader2 className="animate-spin mr-2" />}
                Sign In as {role}
            </Button>
        </div>
      </form>
    </Form>
  );

  const MobileLoginForm = () => (
    <>
    {loginStep === 'mobileInput' && (
      <Form {...mobileForm}>
        <form onSubmit={mobileForm.handleSubmit(onMobileSubmit)} className="space-y-4">
          <FormField
            control={mobileForm.control}
            name="mobile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter 10-digit mobile number"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="pt-2">
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : 'Send OTP'}
            </Button>
          </div>
        </form>
      </Form>
    )}
     {loginStep === 'otpInput' && (
          <Form {...otpForm}>
              <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-6">
                  <div className="space-y-2 text-center">
                    <p>Enter the 6-digit OTP sent to {mobileNumber}</p>
                    <p className="text-sm text-muted-foreground">(Mock OTP: 123456)</p>
                  </div>
                  <Controller
                      control={otpForm.control}
                      name="otp"
                      render={({ field }) => (
                          <OtpInput
                              value={field.value}
                              onChange={field.onChange}
                              numInputs={6}
                              containerStyle="flex justify-center gap-2"
                              inputStyle="!w-10 h-12 text-lg border rounded-md"
                              renderInput={(props) => <input {...props} />}
                          />
                      )}
                  />
                  <div className="pt-2">
                      <Button
                          type="submit"
                          className="w-full"
                          size="lg"
                          disabled={isSubmitting}
                      >
                          {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : 'Verify & Sign In'}
                      </Button>
                  </div>
                   <Button variant="link" className="w-full" onClick={() => setLoginStep('mobileInput')}>
                      Back to mobile input
                  </Button>
              </form>
          </Form>
      )}
    </>
  );

  const CitizenLoginForm = () => (
     <div className="pt-4">
        <MobileLoginForm />
     </div>
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <CivicSolveLogo className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="text-3xl font-headline">
            Waste Management Platform
          </CardTitle>
          <CardDescription className="text-lg font-semibold text-primary !mt-2" style={{ textShadow: '0px 1px 2px rgba(0,0,0,0.1)'}}>
            Segregate. Report. Recycle.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="Citizen" className="w-full" onValueChange={(value) => handleTabChange(value as Role)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="Citizen">Citizen</TabsTrigger>
              <TabsTrigger value="Admin">Admin</TabsTrigger>
              <TabsTrigger value="Head">Head</TabsTrigger>
            </TabsList>
            <TabsContent value="Citizen" className="pt-4">
               <p className="text-sm text-muted-foreground text-center h-10 flex items-center justify-center px-4">
                 Sign in with your mobile number to report issues, track progress, and earn rewards.
                </p>
                <CitizenLoginForm />
            </TabsContent>
            <TabsContent value="Admin">
               <p className="text-sm text-muted-foreground text-center h-10 flex items-center justify-center px-4">
                 {roleCredentials.Admin.description}
                </p>
              <EmailLoginForm role="Admin" />
            </TabsContent>
            <TabsContent value="Head">
                 <p className="text-sm text-muted-foreground text-center h-10 flex items-center justify-center px-4">
                 {roleCredentials.Head.description}
                </p>
              <EmailLoginForm role="Head" />
            </TabsContent>
          </Tabs>
           <div className="mt-4 text-center text-sm">
            Want a new account?{' '}
            <Link href="/signup" className="underline">
              Sign Up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
