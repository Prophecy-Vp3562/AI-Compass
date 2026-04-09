const express = require('express');
const cors = require('cors');
const path = require('path');



const app = express();
app.use(cors());
app.use(express.json());

// Load tools data
let tools = [];
try {
    tools = require('../data/tools.json');
} catch (err) {
    console.error('Error reading tools data:', err);
}

const router = express.Router();

router.get('/tools', (req, res) => {
    try {
        res.json(tools);
    } catch (error) {
        res.status(500).json({ message: "Error loading tools." });
    }
});

router.get('/search', (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.json([]);
        }

        const lowercaseQuery = query.toLowerCase();
        
        // Filter based on name, category, or description
        const results = tools.filter(tool => {
            const nameMatch = tool.name && tool.name.toLowerCase().includes(lowercaseQuery);
            const categoryMatch = tool.category && tool.category.toLowerCase().includes(lowercaseQuery);
            const descMatch = tool.description && tool.description.toLowerCase().includes(lowercaseQuery);
            const legacyCategoryMatch = tool.cat && tool.cat.toLowerCase().includes(lowercaseQuery);
            const legacyDescMatch = tool.desc && tool.desc.toLowerCase().includes(lowercaseQuery);

            return nameMatch || categoryMatch || descMatch || legacyCategoryMatch || legacyDescMatch;
        });

        res.json(results);
    } catch (error) {
        res.status(500).json({ message: "Error performing search." });
    }
});

router.get('/tools/:id', (req, res) => {
    try {
        const id = req.params.id;
        const tool = tools.find(t => t.id === id);
        
        if (tool) {
            res.json(tool);
        } else {
            res.status(404).json({ message: "Tool not found." });
        }
    } catch (error) {
        res.status(500).json({ message: "Error retrieving the tool." });
    }
});

// Health check endpoint
router.get('/', (req, res) => {
    res.send('AI Compass Backend API is running!');
});

// Map routes
app.use('/api', router);
app.use('/.netlify/functions/api', router);

// Serve frontend static files robustly for local development
app.use(express.static(path.join(__dirname, '../../frontend')));

module.exports = app;
