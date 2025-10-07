import dotenv from 'dotenv';
dotenv.config();

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const scanReceiptWithGemini = async (file) => {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const imagePart = {
        inlineData: {
            data: file.buffer.toString('base64'),
            mimeType: file.mimetype,
        },
    };

    const prompt = `
      Analyze this receipt image and extract the following information in JSON format:
      - Total amount (as a number)
      - Date (in YYYY-MM-DD format)
      - A brief description or list of items
      - Suggested category (e.g., groceries, food, utilities, etc.)
      
      Respond only with valid JSON:
      {
        "type": "expense"/"income",
        "amount": number,
        "category": "groceries/food/transport/bill/shopping/others",
        "description": "Weekly shopping",
        "date": "2023-10-27"
    }
    `;

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    try {
        // Clean markdown formatting if present
        let cleanedText = text.trim();
        
        // Remove markdown code blocks
        cleanedText = cleanedText.replace(/``````\n?/g, '');
        
        const parsedData = JSON.parse(cleanedText);
        return parsedData;
    } catch (error) {
        console.error('Failed to parse Gemini response:', text);
        throw new Error('Failed to parse response from Gemini: ' + error.message);
    }
};