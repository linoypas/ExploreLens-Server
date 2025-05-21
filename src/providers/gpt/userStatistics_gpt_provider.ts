import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,  
});

export async function askUserStatisticsGPT(prompt: string): Promise<string> {
  if (!prompt || typeof prompt !== "string") {
    throw new Error("A non‐empty prompt string is required");
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4", 
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that summarizes user travel statistics—country counts, continents, visit percentages, etc."
        },
        {
          role: "user",
          content: prompt
        }
      ],
    });

    const reply = completion.choices[0].message.content;
    if (!reply) {
      throw new Error("Empty response from GPT");
    }
    return reply;
  } catch (err) {
    console.error("askUserStatisticsGPT error:", err);
    throw new Error("Failed to fetch user statistics from GPT");
  }
}
