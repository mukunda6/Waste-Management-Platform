
'use client';

import { useState } from 'react';
import Link from 'next/link';
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
import { Loader2, Upload, CheckCircle, XCircle, GraduationCap, ScanLine } from 'lucide-react';
import Image from 'next/image';
import { checkImageClarity } from '@/ai/flows/image-clarity-check';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

export function WasteScannerDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<{
    isClear: boolean;
    reason?: string;
    wasteType?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleAnalysis = async (file: File) => {
    if (!user) return;
    setIsLoading(true);
    setAnalysisResult(null);

    try {
      const reader = new FileReader();
      reader.onload = async e => {
        const dataUri = e.target?.result as string;
        const result = await checkImageClarity({ photoDataUri: dataUri });

        setAnalysisResult({
          isClear: result.isClear,
          reason: result.reason,
          wasteType: result.wasteType,
        });

        if (!result.isClear) {
          toast({
            variant: 'destructive',
            title: 'Image Unclear',
            description: result.reason || 'Please try taking a clearer photo.',
          });
        }
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Waste analysis failed:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'Could not analyze the image. Please try again.',
      });
      setIsLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setAnalysisResult(null); // Reset previous result
      handleAnalysis(file); // Automatically start analysis
    }
  };

  const resetState = () => {
    setImagePreview(null);
    setAnalysisResult(null);
    setIsLoading(false);
    setIsOpen(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
            <ScanLine className="mr-2 h-4 w-4" />
            Scan Waste
        </Button>
      </DialogTrigger>
      <DialogContent onInteractOutside={(e) => e.preventDefault()} className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Waste Scanner</DialogTitle>
          <DialogDescription>
            Upload a photo of waste to quickly identify its type.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
            <div className="flex flex-col items-center justify-center w-full">
                <label
                    htmlFor="scanner-file-upload"
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
                    id="scanner-file-upload"
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
                    Analyzing Image...
                </div>
            )}
            {analysisResult && (
                <div className={cn("p-3 rounded-md text-sm space-y-2", 
                    analysisResult.isClear ? "bg-blue-100 text-blue-900" : "bg-red-100 text-red-900"
                )}>
                    <div className="flex items-center gap-2">
                         {analysisResult.isClear ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                         <p className="font-bold">
                            Detected Waste Type: {analysisResult.wasteType || 'Uncertain'}
                         </p>
                    </div>
                     {!analysisResult.isClear && (
                        <p>Note: {analysisResult.reason}</p>
                     )}
                     <p>
                        You can now log this under the correct category or report an issue if needed.
                     </p>
                </div>
            )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={resetState}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
