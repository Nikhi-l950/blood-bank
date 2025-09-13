require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');

const donorsRouter = require('./routes/donors');
const contactsRouter = require('./routes/contacts');

const app = express();

// Middleware
app.use(cors({ origin: '*'}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static hosting (optional). Serve frontend from project root if desired
const FRONTEND_DIR = path.join(__dirname, '..');
const PUBLIC_INDEX = path.join(FRONTEND_DIR, 'index.html');

// If you place this server at project root, uncomment next line to serve static files
app.use(express.static(FRONTEND_DIR));

// API routes
app.use('/api/donors', donorsRouter);
app.use('/api/contacts', contactsRouter);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
});

// Fallback to index.html for frontend
app.get('*', (req, res) => {
    res.sendFile(PUBLIC_INDEX);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
}); 