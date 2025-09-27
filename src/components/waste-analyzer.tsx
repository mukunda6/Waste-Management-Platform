
'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Loader2, Upload, ScanLine, Trash2, Recycle, Biohazard } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import type { WasteAnalyzerOutput } from '@/ai/flows/waste-analyzer-flow';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

const resultStyles = {
    'Dry Waste': {
        icon: <Recycle className="h-6 w-6 text-blue-500" />,
        badgeClass: 'bg-blue-100 text-blue-800',
        textClass: 'text-blue-700',
        description: 'Items like plastic, paper, metal, and glass. Should be clean and dry.'
    },
    'Wet Waste': {
        icon: <Trash2 className="h-6 w-6 text-green-500" />,
        badgeClass: 'bg-green-100 text-green-800',
        textClass: 'text-green-700',
        description: 'Organic waste like food scraps, vegetable peels, and garden waste.'
    },
    'Hazardous Waste': {
        icon: <Biohazard className="h-6 w-6 text-red-500" />,
        badgeClass: 'bg-red-100 text-red-800',
        textClass: 'text-red-700',
        description: 'Items like batteries, paint, bulbs, and electronics. Dispose of separately.'
    },
    'Not Waste': {
        icon: <ScanLine className="h-6 w-6 text-gray-500" />,
        badgeClass: 'bg-gray-100 text-gray-800',
        textClass: 'text-gray-700',
        description: 'This does not appear to be a waste item.'
    }
}


export function WasteAnalyzer() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<WasteAnalyzerOutput | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUri = e.target?.result as string;
        setImagePreview(dataUri);
        setResult(null); // Clear previous result
        handleAnalyze(dataUri);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async (photoDataUri: string) => {
    setIsLoading(true);
    // Simulate a short delay for UX
    await new Promise(resolve => setTimeout(resolve, 1000));
    setResult({
        wasteType: 'Dry Waste',
        reason: ''
    });
    setIsLoading(false);
  };
  
  const uniqueId = "waste-analyzer-upload";

  return (
    <div className="space-y-4">
      <Input
        id={uniqueId}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={isLoading}
      />
      <Button asChild variant="outline" className="w-full" disabled={isLoading}>
        <label htmlFor={uniqueId} className="cursor-pointer">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload Photo to Analyze
            </>
          )}
        </label>
      </Button>

      {(imagePreview || result) && (
        <Card>
          <CardContent className="p-4 space-y-4">
            {imagePreview && (
                <div className="relative w-full aspect-video rounded-md overflow-hidden">
                     <Image src={imagePreview} alt="Waste preview" layout="fill" objectFit="cover" />
                </div>
            )}
            
            {result && result.wasteType && (
                <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-2">
                        {resultStyles[result.wasteType].icon}
                        <h3 className={cn("text-xl font-bold", resultStyles[result.wasteType].textClass)}>{result.wasteType}</h3>
                    </div>
                    <Badge variant="outline" className={cn("font-semibold", resultStyles[result.wasteType].badgeClass)}>
                        {resultStyles[result.wasteType].description}
                    </Badge>
                     {result.reason && <p className="text-sm text-muted-foreground italic">"{result.reason}"</p>}
                </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
