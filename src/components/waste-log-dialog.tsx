
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, CheckCircle, XCircle } from 'lucide-react';
import Image from 'next/image';
import { checkWasteSegregation } from '@/ai/flows/waste-segregation-check';
import { cn } from '@/lib/utils';

interface WasteLogDialogProps {
  wasteType: 'Dry Waste' | 'Wet Waste' | 'Hazardous Waste';
}

export function WasteLogDialog({ wasteType }: WasteLogDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<{
    correct: boolean;
    reason: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setAnalysisResult(null); // Reset previous result
    }
  };

  const handleVerify = async () => {
    if (!imageFile) {
      toast({
        variant: 'destructive',
        title: 'No Image',
        description: 'Please upload a photo of your waste.',
      });
      return;
    }

    setIsLoading(true);
    setAnalysisResult(null);

    try {
      const reader = new FileReader();
      reader.onload = async e => {
        const dataUri = e.target?.result as string;
        const result = await checkWasteSegregation({
          photoDataUri: dataUri,
          expectedWasteType: wasteType,
        });

        setAnalysisResult({
          correct: result.isCorrectlySegregated,
          reason: result.reason,
        });

        if (result.isCorrectlySegregated) {
          toast({
            title: 'Verification Successful!',
            description: `You've earned 10 compliance points for correct segregation.`,
          });
        } else {
          toast({
            variant: 'destructive',
            title: 'Segregation Incorrect',
            description: result.reason,
          });
        }
      };
      reader.readAsDataURL(imageFile);
    } catch (error) {
      console.error('Waste verification failed:', error);
      toast({
        variant: 'destructive',
        title: 'Verification Failed',
        description: 'Could not analyze the image. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setIsOpen(false);
    setImagePreview(null);
    setImageFile(null);
    setAnalysisResult(null);
    setIsLoading(false);
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
                />
            </div>
            {analysisResult && (
                <div className={cn("p-3 rounded-md text-sm flex items-center gap-2", 
                    analysisResult.correct ? "bg-green-100 text-green-900" : "bg-red-100 text-red-900"
                )}>
                    {analysisResult.correct ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                    {analysisResult.reason}
                </div>
            )}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={resetState}>Close</Button>
          <Button onClick={handleVerify} disabled={isLoading || !imageFile}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verify & Log
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
