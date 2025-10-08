# FinAssist - Personal Finance Assistant

A full-stack web application designed to help users track, manage, and understand their financial activities. Users can log income and expenses, categorize transactions, view spending summaries through interactive graphs, and extract transaction data from receipts using AI-powered OCR.

![Demo Preview](assets/demo.gif)



## Tech Stack

### Backend
- Node.js with Express.js
- MongoDB for data persistence
- JWT for authentication
- Gemini AI for receipt/document processing

### Frontend
- Vite + React
- TypeScript
- Tailwind CSS
- shadcn/ui components

## Project Structure
```markdown
FinAssist/
├── backend/ # Express.js API server
├── frontend/ # React application
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account or local MongoDB instance

### Backend Setup

1. Navigate to the backend directory:
```console
cd backend
```

2. Install dependencies:
```console
npm i
```

3. Create a `.env` file in the root of `/backend` with the following configuration:
```console
Server Port
PORT=5000

Gemini AI API Key
GEMINI_API_KEY=your_gemini_api_key_here

MongoDB Connection String
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

JWT Configuration
JWT_SECRET=super-secret-key-for-my-finance-app-that-no-one-will-guess-12345!
JWT_EXPIRE=30d

```
**Important**: Replace the placeholder values with your actual credentials:
- `GEMINI_API_KEY`: Obtain from Google AI Studio
- `MONGO_URI`: Get from MongoDB Atlas or use local MongoDB connection string
- `JWT_SECRET`: Use a strong, unique secret key for production

4. Start the backend server:
```console
npm start

```

The API server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```console
cd frontend
```

2. Install dependencies:
```console
npm i
```

3. Start the development server:
```console
npm run dev
```

The application will be available at `http://localhost:5173` (default Vite port)

## Usage

1. Start both backend and frontend servers following the setup instructions above
2. Open your browser and navigate to the frontend URL
3. Register a new account or log in with existing credentials
4. Start adding income and expense entries
5. Upload receipts to automatically extract transaction data
6. View analytics and spending patterns through the dashboard graphs

## Author

Ayush
