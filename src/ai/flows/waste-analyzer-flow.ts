
'use server';
/**
 * @fileOverview An AI flow for analyzing and classifying waste from an image.
 *
 * - analyzeWaste - A function that handles the waste analysis process.
 * - WasteAnalyzerInput - The input type for the analyzeWaste function.
 * - WasteAnalyzerOutput - The return type for the analyzeWaste function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WasteAnalyzerInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a waste item, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type WasteAnalyzerInput = z.infer<typeof WasteAnalyzerInputSchema>;

const WasteAnalyzerOutputSchema = z.object({
  wasteType: z.enum(['Dry Waste', 'Wet Waste', 'Hazardous Waste', 'Not Waste'])
    .describe('The classified type of waste.'),
  reason: z.string().describe('A brief reason for the classification.')
});
export type WasteAnalyzerOutput = z.infer<typeof WasteAnalyzerOutputSchema>;

export async function analyzeWaste(input: WasteAnalyzerInput): Promise<WasteAnalyzerOutput> {
  return wasteAnalyzerFlow(input);
}

const wasteAnalyzerPrompt = ai.definePrompt({
  name: 'wasteAnalyzerPrompt',
  input: {schema: WasteAnalyzerInputSchema},
  output: {schema: WasteAnalyzerOutputSchema},
  prompt: `You are a waste classification expert. Analyze the provided image and determine if it contains a waste item.

- If it is waste, classify it into one of the following categories: 'Dry Waste', 'Wet Waste', or 'Hazardous Waste'.
- If the image does not contain a waste item, classify it as 'Not Waste'.
- Provide a brief, one-sentence reason for your classification.

Image: {{media url=photoDataUri}}`,
});

const wasteAnalyzerFlow = ai.defineFlow(
  {
    name: 'wasteAnalyzerFlow',
    inputSchema: WasteAnalyzerInputSchema,
    outputSchema: WasteAnalyzerOutputSchema,
  },
  async input => {
    const {output} = await wasteAnalyzerPrompt(input);
    return output!;
  }
);
