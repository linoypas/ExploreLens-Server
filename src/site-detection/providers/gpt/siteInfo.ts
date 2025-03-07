import OpenAI from "openai";
import dotenv from 'dotenv';

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
                content: 'You are a helpful assistant that provides detailed information about landmarks and famous sites.',
            },
            {
                role: 'user',
                content: `Please provide detailed information about the landmark called ${siteName}`,
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
