const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS so the Netlify frontend can talk to this Render backend
app.use(cors());
app.use(express.json());

// Helper function to read the tools from JSON file
const getTools = () => {
    const filePath = path.join(__dirname, 'tools.json');
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
};

// 1. GET /tools -> Return all AI tools
app.get('/tools', (req, res) => {
    try {
        const tools = getTools();
        res.json(tools);
    } catch (error) {
        res.status(500).json({ message: "Error loading tools." });
    }
});

// 2. GET /search?q=keyword -> Return filtered tools (case-insensitive)
app.get('/search', (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.json([]);
        }

        const lowercaseQuery = query.toLowerCase();
        const tools = getTools();
        
        // Filter based on name, category, or description
        const results = tools.filter(tool => {
            const nameMatch = tool.name && tool.name.toLowerCase().includes(lowercaseQuery);
            const categoryMatch = tool.category && tool.category.toLowerCase().includes(lowercaseQuery);
            const descMatch = tool.description && tool.description.toLowerCase().includes(lowercaseQuery);
            return nameMatch || categoryMatch || descMatch;
        });

        res.json(results);
    } catch (error) {
        res.status(500).json({ message: "Error performing search." });
    }
});

// 3. GET /tools/:id -> Return details of a specific tool
app.get('/tools/:id', (req, res) => {
    try {
        const id = req.params.id;
        const tools = getTools();
        
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

// Health check endpoint (good for Render deployment testing)
app.get('/', (req, res) => {
    res.send('AI Compass Backend is running!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Backend API running on http://localhost:${PORT}`);
});
