import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedStudyMaterials } from '../types';

// Lazily initialize the AI client to prevent app crash on load if API key is not set.
let ai: GoogleGenAI | null = null;

const getAiClient = (): GoogleGenAI => {
    if (ai) {
        return ai;
    }
    
    const API_KEY = process.env.API_KEY;
    if (!API_KEY) {
        // This error will be caught by the calling function.
        throw new Error("API key not configured. Please set the API_KEY environment variable.");
    }

    ai = new GoogleGenAI({ apiKey: API_KEY });
    return ai;
};

const studyMaterialSchema = {
    type: Type.OBJECT,
    properties: {
        summary: {
            type: Type.STRING,
            description: "A concise summary of the provided text, capturing the main points.",
        },
        flashcards: {
            type: Type.ARRAY,
            description: "A list of key terms and their definitions from the text.",
            items: {
                type: Type.OBJECT,
                properties: {
                    term: { type: Type.STRING, description: "The key term or concept." },
                    definition: { type: Type.STRING, description: "A clear and concise definition of the term." },
                },
                required: ["term", "definition"],
            },
        },
        quiz: {
            type: Type.ARRAY,
            description: "A multiple-choice quiz based on the text content.",
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING, description: "The quiz question." },
                    options: {
                        type: Type.ARRAY,
                        description: "An array of 4 possible answers.",
                        items: { type: Type.STRING },
                    },
                    correctAnswerIndex: {
                        type: Type.INTEGER,
                        description: "The 0-based index of the correct answer in the options array.",
                    },
                },
                required: ["question", "options", "correctAnswerIndex"],
            },
        },
    },
    required: ["summary", "flashcards", "quiz"],
};

export const generateStudyMaterials = async (text: string): Promise<GeneratedStudyMaterials> => {
    try {
        const aiClient = getAiClient(); // Initialization happens here
        
        const prompt = `Based on the following text, please generate a comprehensive set of study materials. The materials should include a concise summary, a series of flashcards for key terms, and a multiple-choice quiz to test understanding.

    Text to process:
    ---
    ${text}
    ---

    Please provide the output in the specified JSON format. Ensure the quiz has 4 options for each question.
    `;
        const response = await aiClient.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: studyMaterialSchema,
            },
        });
        
        const jsonString = response.text.trim();
        const parsedJson = JSON.parse(jsonString);
        
        // Basic validation
        if (!parsedJson.summary || !Array.isArray(parsedJson.flashcards) || !Array.isArray(parsedJson.quiz)) {
            throw new Error("Invalid response structure from AI.");
        }

        return parsedJson as GeneratedStudyMaterials;

    } catch (error) {
        console.error("Error generating study materials:", error);
        // Re-throw a more user-friendly error message.
        if (error instanceof Error && error.message.includes("API key not configured")) {
            throw error;
        }
        throw new Error("Failed to generate study materials. Please check the console for more details.");
    }
};