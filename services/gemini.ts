import { GoogleGenAI, Chat } from "@google/genai";
import { getProjects } from "./storage";

// Initialize Gemini
// Note: In a real production app, ensure API keys are not exposed to the client if possible,
// or use a backend proxy. For this demo, we use the env var directly as per instructions.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateProjectDescription = async (title: string, techStack: string[]): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      Write a professional, compelling, and technical project description for a Web Developer portfolio.
      
      Project Title: ${title}
      Tech Stack: ${techStack.join(', ')}
      
      The description should be around 50-80 words. Focus on the technical implementation, features, and user benefits. 
      Sound like a skilled Web Developer.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "Could not generate description.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate description via Gemini AI.");
  }
};

export const createPortfolioChatSession = (): Chat => {
  const projects = getProjects();
  
  // Construct the knowledge base from current projects
  const projectsContext = projects.map(p => 
    `- Project Name: ${p.title}
     - Description: ${p.description}
     - Tech Stack: ${p.techStack.join(', ')}
     - Links: ${p.playStoreUrl ? 'Demo/Site available' : ''} ${p.githubUrl ? 'GitHub available' : ''}`
  ).join('\n\n');

  const systemInstruction = `
    You are an AI Assistant for a Junior Web Developer's Portfolio named "Rabin Adhikari".
    
    Your role is to answer questions strictly about the developer's projects, skills, and professional background based on the context provided below.
    
    The Developer is a Junior Web Developer specializing in React, TypeScript, and modern web development.

    Here is the list of projects in the portfolio:
    ${projectsContext}

    Rules:
    1. Only answer questions related to the portfolio, the projects listed above, or Web development skills.
    2. If a user asks about something unrelated, politely decline and steer them back to the portfolio.
    3. Keep answers concise, professional, and enthusiastic.
    4. STORY MODE: If the user asks for a "Story" or uses the Story feature, use your creative license to narrate a dramatic or engaging "behind-the-scenes" journey of how one of the projects was built. Talk about the challenges (e.g., "We struggled with race conditions in the API state...") and the eventual success. Make it sound heroic but grounded in technical reality.
    5. IMAGE INPUT: If the user provides an image, assume it is a screenshot of a web app or UI design. Provide constructive feedback or relate it to the style of the portfolio projects.
  `;

  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: systemInstruction,
    },
  });
};