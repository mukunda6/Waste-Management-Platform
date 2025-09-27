
'use server';

/**
 * @fileOverview An AI agent that checks the clarity of an image and classifies waste type.
 *
 * - checkImageClarity - A function that checks image clarity and classifies waste.
 * - CheckImageClarityInput - The input type for the checkImageClarity function.
 * - CheckImageClarityOutput - The return type for the checkImageClarity function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CheckImageClarityInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo to check the clarity of, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type CheckImageClarityInput = z.infer<typeof CheckImageClarityInputSchema>;

const CheckImageClarityOutputSchema = z.object({
  isClear: z.boolean().describe('Whether or not the image is clear.'),
  reason: z.string().optional().describe('The reason why the image is not clear, if applicable.'),
  wasteType: z.enum(['Dry Waste', 'Wet Waste', 'Uncertain']).describe('The classified type of waste in the image.'),
});
export type CheckImageClarityOutput = z.infer<typeof CheckImageClarityOutputSchema>;

export async function checkImageClarity(input: CheckImageClarityInput): Promise<CheckImageClarityOutput> {
  return checkImageClarityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'checkImageClarityPrompt',
  input: {schema: CheckImageClarityInputSchema},
  output: {schema: CheckImageClarityOutputSchema},
  prompt: `You are an expert image quality detector and waste classifier.

You will use this information to determine if the image is clear enough for assessing a civic issue and classify the type of waste shown.

1.  **Clarity Check**: An image is considered unclear if it is blurry, too dark, too bright, or if the main subject is obstructed or too far away. Set the isClear output field appropriately. If the image is not clear, provide a brief, user-friendly reason in the reason field (e.g., "Image is too blurry", "It's too dark to see details").

2.  **Waste Classification**: Analyze the content of the image to determine the type of waste. Classify it as 'Dry Waste' (e.g., plastic, paper, metal), 'Wet Waste' (e.g., food scraps, organic material), or 'Uncertain' if you cannot determine. Set the wasteType field.

Image: {{media url=photoDataUri}}`,
});

const checkImageClarityFlow = ai.defineFlow(
  {
    name: 'checkImageClarityFlow',
    inputSchema: CheckImageClarityInputSchema,
    outputSchema: CheckImageClarityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
    
