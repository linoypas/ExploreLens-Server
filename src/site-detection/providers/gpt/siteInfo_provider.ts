import OpenAI from "openai";
import dotenv from 'dotenv';
import { GptPromptForSystem, GptPromptForUser } from "../prompts";

dotenv.config();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,  // Ensure your OpenAI API key is loaded correctly
});

async function fetchSiteInfo(siteName: string): Promise<string> {
  if (!siteName) {
    throw new Error('Site name is required');
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",  // Correct model name (check if you need another version)
      messages: [
        {
          role: 'system',
          content: GptPromptForSystem,
        },
        {
          role: 'user',
          content: `${GptPromptForUser} ${siteName}`,
        },
      ],
    });
    
    // Log the actual response content
    const result=response.choices[0].message.content || '';
    if (result) {
      console.log(`Detected Landmark: ${result}`);
    } else {
      console.warn("No landmark detected.");
    }
    return result;
  } catch (error) {
    console.error('Error fetching site info:', error);
    throw new Error('Failed to fetch site info from GPT');
  }
}

export { fetchSiteInfo };
