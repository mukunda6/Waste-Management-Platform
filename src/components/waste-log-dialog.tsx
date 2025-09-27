
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { updateUserScore } from '@/lib/firebase-service';

interface WasteLogDialogProps {
  wasteType: 'Dry Waste' | 'Wet Waste' | 'Hazardous Waste';
}

export function WasteLogDialog({ wasteType }: WasteLogDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user, refreshUser } = useAuth();
  const [submitted, setSubmitted] = useState(false);


  const handleVerify = async (file: File) => {
    if (!user) return;
    setIsLoading(true);
    
    // Simulate a short delay for UX
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
        await updateUserScore(user.uid, 10);
        await refreshUser();
        toast({
            title: 'Log Submitted!',
            description: `You've earned 10 compliance points for logging your ${wasteType}.`,
        });
        setSubmitted(true);
        setIsLoading(false);
    } catch (error) {
        console.error('Waste logging failed:', error);
        toast({
            variant: 'destructive',
            title: 'Submission Failed',
            description: 'Could not save your log. Please try again.',
        });
        setIsLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      handleVerify(file); // Automatically start verification
    }
  };

  const resetState = () => {
    setImagePreview(null);
    setIsLoading(false);
    setIsOpen(false);
    setSubmitted(false);
  };
  
  const wasteTypeClasses = {
    'Dry Waste': 'border-blue-500 hover:bg-blue-50',
    'Wet Waste': 'border-green-500 hover:bg-green-50',
    'Hazardous Waste': 'border-destructive hover:bg-destructive/10 text-destructive'
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={cn("w-full justify-start", wasteTypeClasses[wasteType])}>
          Log {wasteType}
        </Button>
      </DialogTrigger>
      <DialogContent onInteractOutside={(e) => e.preventDefault()} className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Log Your {wasteType}</DialogTitle>
          <DialogDescription>
            Upload a photo of your segregated {wasteType.toLowerCase()} to earn compliance points.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
            <div className="flex flex-col items-center justify-center w-full">
                <label
                    htmlFor={`file-upload-${wasteType}`}
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted"
                >
                    {imagePreview ? (
                        <Image
                            src={imagePreview}
                            alt="Waste preview"
                            width={200}
                            height={192}
                            className="object-cover h-full w-full rounded-lg"
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                            <p className="mb-2 text-sm text-muted-foreground">
                                <span className="font-semibold">Click to upload</span> a photo
                            </p>
                            <p className="text-xs text-muted-foreground">PNG, JPG, or JPEG</p>
                        </div>
                    )}
                </label>
                 <Input
                    id={`file-upload-${wasteType}`}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={isLoading}
                />
            </div>
            {isLoading && (
                <div className="p-3 rounded-md text-sm flex items-center justify-center gap-2 bg-muted">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting Log...
                </div>
            )}
            {submitted && (
                <div className={cn("p-3 rounded-md text-sm space-y-2 bg-green-100 text-green-900")}>
                    <div className="flex items-center gap-2">
                         <CheckCircle className="h-4 w-4" />
                         <p>Thank you for your submission! Points have been added to your account.</p>
                    </div>
                </div>
            )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={resetState}>
            {submitted ? 'Done' : 'Close'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
