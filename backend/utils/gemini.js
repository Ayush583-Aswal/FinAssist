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
      
      Respond only with valid JSON.
    `;

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    try {
        return JSON.parse(text);
    } catch (error) {
        throw new Error('Failed to parse response from Gemini');
    }
};