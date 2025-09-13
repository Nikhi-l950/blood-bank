const express = require('express');
const router = express.Router();
const pool = require('../db');

// Create contacts table if not exists
async function ensureTable() {
    await pool.execute(`
        CREATE TABLE IF NOT EXISTS contacts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(150) NOT NULL,
            email VARCHAR(150) NOT NULL,
            subject VARCHAR(200) NOT NULL,
            message TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
}

ensureTable().catch(console.error);

router.post('/', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const sql = `INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)`;
        const params = [name, email, subject, message];
        const [result] = await pool.execute(sql, params);
        res.status(201).json({ id: result.insertId, message: 'Message received' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

module.exports = router; 