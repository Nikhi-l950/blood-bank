const express = require('express');
const router = express.Router();
const pool = require('../db');

// Create donors table if not exists
async function ensureTable() {
    await pool.execute(`
        CREATE TABLE IF NOT EXISTS donors (
            id INT AUTO_INCREMENT PRIMARY KEY,
            first_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100) NOT NULL,
            email VARCHAR(150) NOT NULL,
            phone VARCHAR(30) NOT NULL,
            age INT NOT NULL,
            weight_kg INT NOT NULL,
            blood_type VARCHAR(5) NOT NULL,
            preferred_camp VARCHAR(50) NULL,
            medical_history TEXT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
}

ensureTable().catch(console.error);

router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM donors ORDER BY created_at DESC LIMIT 200');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch donors' });
    }
});

router.post('/', async (req, res) => {
    try {
        const {
            firstName, lastName, email, phone, age, weight, bloodType, preferredCamp, medicalHistory
        } = req.body;

        if (!firstName || !lastName || !email || !phone || !age || !weight || !bloodType) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const sql = `
            INSERT INTO donors
            (first_name, last_name, email, phone, age, weight_kg, blood_type, preferred_camp, medical_history)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const params = [firstName, lastName, email, phone, Number(age), Number(weight), bloodType, preferredCamp || null, medicalHistory || null];
        const [result] = await pool.execute(sql, params);

        res.status(201).json({ id: result.insertId, message: 'Donor registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to register donor' });
    }
});

module.exports = router; 