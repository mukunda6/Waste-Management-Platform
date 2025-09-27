
'use server';

/**
 * @fileOverview An AI agent that verifies correct waste segregation from an image.
 *
 * - checkWasteSegregation - A function that verifies if the waste in an image is correctly segregated.
 * - CheckWasteSegregationInput - The input type for the checkWasteSegregation function.
 * - CheckWasteSegregationOutput - The return type for the checkWasteSegregation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CheckWasteSegregationInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of segregated waste, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  expectedWasteType: z.enum(['Dry Waste', 'Wet Waste', 'Hazardous Waste']).describe('The type of waste that is expected to be in the image.'),
});
export type CheckWasteSegregationInput = z.infer<typeof CheckWasteSegregationInputSchema>;

const CheckWasteSegregationOutputSchema = z.object({
  isCorrectlySegregated: z.boolean().describe('Whether the waste in the image is correctly segregated according to the expected type.'),
  reason: z.string().describe('A brief explanation for the decision, especially if it is not correctly segregated (e.g., "Image contains mixed waste like food scraps in a dry waste bin.").'),
});
export type CheckWasteSegregationOutput = z.infer<typeof CheckWasteSegregationOutputSchema>;

export async function checkWasteSegregation(input: CheckWasteSegregationInput): Promise<CheckWasteSegregationOutput> {
  return checkWasteSegregationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'checkWasteSegregationPrompt',
  input: {schema: CheckWasteSegregationInputSchema},
  output: {schema: CheckWasteSegregationOutputSchema},
  prompt: `You are an expert waste management inspector. Your task is to verify if a user has correctly segregated their waste based on an uploaded image.

You will be given a photo and the type of waste the user claims it is.

**Expected Waste Type:** {{{expectedWasteType}}}

**Image to Analyze:**
{{media url=photoDataUri}}

**Your Task:**
1.  **Analyze the image:** Carefully examine the contents of the waste bin or pile in the photo.
2.  **Compare with expectations:**
    *   If **Expected Waste Type** is **"Wet Waste"**, look for compostable materials like fruit/vegetable peels, leftover food, coffee grounds, and garden waste. The presence of plastic, metal, or paper would be incorrect.
    *   If **Expected Waste Type** is **"Dry Waste"**, look for recyclable materials like plastic bottles, containers, paper, cardboard, and metal cans. The presence of food scraps or organic matter would be incorrect.
    *   If **Expected Waste Type** is **"Hazardous Waste"**, look for items like batteries, light bulbs, paint cans, or e-waste. It should not contain regular dry or wet waste.
3.  **Make a decision:**
    *   Set **isCorrectlySegregated** to \`true\` if the waste in the image correctly matches the expected type.
    *   Set **isCorrectlySegregated** to \`false\` if you see significant contamination with other waste types.
4.  **Provide a reason:** Briefly explain your decision in the **reason** field. If incorrect, clearly state what was wrong (e.g., "Incorrect. Plastic items found in wet waste." or "Correct. Only dry recyclable materials are visible."). Be specific about the contaminants found.`,
});

const checkWasteSegregationFlow = ai.defineFlow(
  {
    name: 'checkWasteSegregationFlow',
    inputSchema: CheckWasteSegregationInputSchema,
    outputSchema: CheckWasteSegregationOutputSchema,
  },
  async input => {
    const {output} = await ai.generate({
        model: 'googleai/gemini-1.5-flash',
        prompt: `You are an expert waste management inspector. Your task is to verify if a user has correctly segregated their waste based on an uploaded image.

You will be given a photo and the type of waste the user claims it is.

**Expected Waste Type:** ${input.expectedWasteType}

**Image to Analyze:**
{{media url=${input.photoDataUri}}}

**Your Task:**
1.  **Analyze the image:** Carefully examine the contents of the waste bin or pile in the photo.
2.  **Compare with expectations:**
    *   If **Expected Waste Type** is **"Wet Waste"**, look for compostable materials like fruit/vegetable peels, leftover food, coffee grounds, and garden waste. The presence of plastic, metal, or paper would be incorrect.
    *   If **Expected Waste Type** is **"Dry Waste"**, look for recyclable materials like plastic bottles, containers, paper, cardboard, and metal cans. The presence of food scraps or organic matter would be incorrect.
    *   If **Expected Waste Type** is **"Hazardous Waste"**, look for items like batteries, light bulbs, paint cans, or e-waste. It should not contain regular dry or wet waste.
3.  **Make a decision:**
    *   Set **isCorrectlySegregated** to \`true\` if the waste in the image correctly matches the expected type.
    *   Set **isCorrectlySegregated** to \`false\` if you see significant contamination with other waste types.
4.  **Provide a reason:** Briefly explain your decision in the **reason** field. If incorrect, clearly state what was wrong (e.g., "Incorrect. Plastic items found in wet waste." or "Correct. Only dry recyclable materials are visible."). Be specific about the contaminants found.`,
        output: { schema: CheckWasteSegregationOutputSchema }
    });
    return output!;
  }
);
