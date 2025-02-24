import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = 5000 || process.env.PORT ;

// Enable CORS for all origins
app.use(cors({
  origin: ['https://www.pomodoroom.com', 'https://pomodoroom.com', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
})); 

// ✅ Middleware to manually set CORS headers in API responses
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://www.pomodoroom.com");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

// ✅ Root endpoint to prevent 404 errors
app.get("/", (req, res) => {
    res.send("API is running!");
});

// Proxy route for fetching data from Radio Garden API
app.get('/api/search', async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ error: 'Query paeter "q" is required by default' });
  }

  try {
    const response = await fetch(`https://radio.garden/api/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
        throw new Error('Failed to fetch data from Radio Garden API');
    }
    const data = await response.json();

    // ✅ Ensure CORS headers in API response
    res.setHeader("Access-Control-Allow-Origin", "https://www.pomodoroom.com");
    res.json(data);
} catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'Failed to fetch data from Radio Garden API' });
}
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// ✅ Handle OPTIONS requests for preflight checks (important for CORS)
app.options('*', (req, res) => {
  res.sendStatus(200);
});


app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
 