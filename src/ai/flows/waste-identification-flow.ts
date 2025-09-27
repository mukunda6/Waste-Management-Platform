
'use server';

/**
 * @fileOverview An AI agent that identifies the type of waste from an image.
 *
 * - identifyWaste - A function that classifies waste from an image.
 * - IdentifyWasteInput - The input type for the identifyWaste function.
 * - IdentifyWasteOutput - The return type for the identifyWaste function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const IdentifyWasteInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of an item to be identified, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type IdentifyWasteInput = z.infer<typeof IdentifyWasteInputSchema>;

const IdentifyWasteOutputSchema = z.object({
  wasteType: z.enum(['Dry Waste', 'Wet Waste', 'Hazardous Waste', 'E-Waste', 'Not Waste']).describe('The classified type of waste in the image.'),
  itemName: z.string().describe('The name of the item identified in the image (e.g., "Plastic bottle", "Apple core").'),
  disposalInstructions: z.string().describe('Brief, user-friendly instructions on how to properly dispose of the item.'),
});
export type IdentifyWasteOutput = z.infer<typeof IdentifyWasteOutputSchema>;

export async function identifyWaste(input: IdentifyWasteInput): Promise<IdentifyWasteOutput> {
  return wasteIdentificationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'wasteIdentificationPrompt',
  input: {schema: IdentifyWasteInputSchema},
  output: {schema: IdentifyWasteOutputSchema},
  prompt: `You are an expert waste classifier. Your task is to identify the item in the image and classify it into one of the following waste categories: 'Dry Waste', 'Wet Waste', 'Hazardous Waste', 'E-Waste', or 'Not Waste'.

1.  **Identify the Item**: Clearly identify the primary object in the image.
2.  **Classify the Waste**:
    *   **Wet Waste**: Food scraps, vegetable peels, garden waste.
    *   **Dry Waste**: Paper, plastic, metal, glass, cardboard.
    *   **Hazardous Waste**: Batteries, paint cans, chemicals, light bulbs.
    *   **E-Waste**: Electronic items like phones, chargers, cables.
    *   **Not Waste**: If the item is not waste (e.g., a person, a car, an animal).
3.  **Provide Instructions**: Give a short, simple instruction for disposal. For example, "Rinse and place in the blue dry waste bin." or "Drop off at your nearest e-waste collection center."

**Image to Analyze:**
{{media url=photoDataUri}}

Return your response in the specified JSON format.`,
});

const wasteIdentificationFlow = ai.defineFlow(
  {
    name: 'wasteIdentificationFlow',
    inputSchema: IdentifyWasteInputSchema,
    outputSchema: IdentifyWasteOutputSchema,
  },
  async input => {
    const {output} = await prompt(input, {model: googleAI.model('gemini-pro-vision')});
    return output!;
  }
);
