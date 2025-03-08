import OpenAI from "openai";
import dotenv from 'dotenv';
import { GptPromptForSystem, GptPromptForUser } from "../../../prompts";

dotenv.config();
const openai = new OpenAI();

async function fetchSiteInfo(siteName: string) {
  if (!siteName) {
    throw new Error('Site name is required');
  }
  try{
    const response = await openai.chat.completions.create({
        model: "gpt-4o",
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
    console.log('Site info response:', );
    return response.choices[0].message.content;
  } catch (error) {
        console.error('Error fetching site info:', error);
        throw new Error('Failed to fetch site info from GPT');
  }
}

export { fetchSiteInfo };
