
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
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, ScanLine, Info, Recycle, Leaf, AlertTriangle, Laptop } from 'lucide-react';
import Image from 'next/image';
import { identifyWaste, IdentifyWasteOutput } from '@/ai/flows/waste-identification-flow';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';

const wasteTypeInfo = {
    'Dry Waste': { icon: <Recycle className="h-4 w-4" />, color: 'text-blue-500' },
    'Wet Waste': { icon: <Leaf className="h-4 w-4" />, color: 'text-green-500' },
    'Hazardous Waste': { icon: <AlertTriangle className="h-4 w-4" />, color: 'text-red-500' },
    'E-Waste': { icon: <Laptop className="h-4 w-4" />, color: 'text-yellow-500' },
    'Not Waste': { icon: <Info className="h-4 w-4" />, color: 'text-gray-500' },
};


export function WasteScannerDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<IdentifyWasteOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleScan = async (file: File) => {
    setIsLoading(true);
    setAnalysisResult(null);

    try {
      const reader = new FileReader();
      reader.onload = async e => {
        const dataUri = e.target?.result as string;
        const result = await identifyWaste({
          photoDataUri: dataUri,
        });

        setAnalysisResult(result);
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Waste identification failed:', error);
      toast({
        variant: 'destructive',
        title: 'Scan Failed',
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
      handleScan(file); // Automatically start scan
    }
  };

  const resetState = () => {
    // Keep dialog open on close to prevent flicker
    setImagePreview(null);
    setAnalysisResult(null);
    setIsLoading(false);
    setIsOpen(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" variant="outline">
            <ScanLine className="mr-2 h-4 w-4"/>
            Scan Waste
        </Button>
      </DialogTrigger>
      <DialogContent onInteractOutside={(e) => e.preventDefault()} className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>AI Waste Scanner</DialogTitle>
          <DialogDescription>
            Upload a photo of an item to identify its waste type and learn how to dispose of it.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
            <div className="flex flex-col items-center justify-center w-full">
                <label
                    htmlFor="waste-scanner-upload"
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
                    id="waste-scanner-upload"
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
                    Scanning Image...
                </div>
            )}
            {analysisResult && (
                <div className="p-4 border rounded-lg space-y-3">
                    <h3 className="font-semibold">Scan Result:</h3>
                     <div className="flex items-center gap-2">
                        <span className="font-medium">Item:</span>
                        <span>{analysisResult.itemName}</span>
                    </div>
                     <div className="flex items-center gap-2">
                        <span className="font-medium">Type:</span>
                        <Badge variant="outline" className={cn("gap-2", wasteTypeInfo[analysisResult.wasteType].color)}>
                            {wasteTypeInfo[analysisResult.wasteType].icon}
                            {analysisResult.wasteType}
                        </Badge>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="font-medium">Disposal:</span>
                        <span className="text-muted-foreground">{analysisResult.disposalInstructions}</span>
                    </div>
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
