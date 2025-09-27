
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
  detectedWasteType: z.enum(['Dry Waste', 'Wet Waste', 'Hazardous Waste', 'Mixed Waste', 'Uncertain']).optional().describe('The actual type of waste detected in the image, especially if it differs from the expected type.'),
});
export type CheckWasteSegregationOutput = z.infer<typeof CheckWasteSegregationOutputSchema>;

export async function checkWasteSegregation(input: CheckWasteSegregationInput): Promise<CheckWasteSegregationOutput> {
  return checkWasteSegregationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'checkWasteSegregationPrompt',
  model: 'googleai/gemini-1.5-flash-latest',
  input: {schema: CheckWasteSegregationInputSchema},
  output: {schema: CheckWasteSegregationOutputSchema},
  prompt: `Analyze the uploaded image of waste and classify it strictly into one of three categories: Dry, Wet, or Hazardous. Pay close attention to details: if the image contains food, peels, or organic matter, classify as Wet. If it contains plastics, paper, or non-biodegradable items, classify as Dry. If it contains medical, chemical, or sharp objects, classify as Hazardous. Do not accept mismatched inputs (e.g., vegetable waste cannot be Dry). Provide both the predicted category and a short explanation for the classification.

You must determine if the waste in the image is correctly segregated based on the expected waste type.

**Expected Waste Type:** {{{expectedWasteType}}}

**Image to Analyze:**
{{media url=photoDataUri}}

**Your Tasks:**
1.  **Analyze the image:** Carefully examine the contents of the waste bin or pile in the photo.
2.  **Identify Actual Waste Type:** First, determine the primary type of waste visible in the image. Classify it as 'Wet Waste', 'Dry Waste', 'Hazardous Waste', or 'Mixed Waste' if multiple types are present. If you cannot be certain, use 'Uncertain'. Set the \`detectedWasteType\` field with this value.
3.  **Compare and Decide:** Compare your \`detectedWasteType\` with the user's \`expectedWasteType\`.
    *   Set \`isCorrectlySegregated\` to \`true\` if the \`detectedWasteType\` matches the \`expectedWasteType\`.
    *   Set \`isCorrectlySegregated\` to \`false\` if they do not match.
4.  **Provide a Reason:** Briefly explain your decision in the \`reason\` field.
    *   If correct: "Correct. The image contains only {detectedWasteType}."
    *   If incorrect (e.g., vegetable peels in Dry Waste bin): "Incorrect. This appears to be {detectedWasteType}, not {expectedWasteType}."
    *   If incorrect (e.g., broken glass in Wet Waste bin): "Incorrect. This appears to be Hazardous Waste because it contains broken glass." Be specific.

**Be Strict:**
- If a vegetable/food item is uploaded into Dry Waste, it is INCORRECT. The detected waste type is Wet Waste.
- If plastic is uploaded into Wet Waste, it is INCORRECT. The detected waste type is Dry Waste.
- If broken glass is uploaded into Dry or Wet waste, it is INCORRECT. The detected waste type is Hazardous Waste.
`,
});

const checkWasteSegregationFlow = ai.defineFlow(
  {
    name: 'checkWasteSegregationFlow',
    inputSchema: CheckWasteSegregationInputSchema,
    outputSchema: CheckWasteSegregationOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);
      return output!;
    } catch (error) {
      console.error('AI waste segregation check failed:', error);
      // If the AI service fails, default to a "correct" response to avoid blocking the user.
      // Provide a reason indicating the AI check was skipped.
      return {
        isCorrectlySegregated: true,
        reason: 'AI verification is temporarily unavailable. Points awarded for your submission.',
      };
    }
  }
);
