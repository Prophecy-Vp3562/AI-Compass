const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'backend', 'data', 'tools.json');
const currentData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const notebookLm = {
    id: "notebooklm", 
    name: "Google NotebookLM", 
    category: "Productivity", 
    description: "An AI-first notebook by Google. Upload your documents to ground the AI in your own sources and let it answer questions or summarize insights instantly.",
    features: ["Source grounding", "Audio Overviews", "Google Drive sync", "Auto-summarization"],
    pricing: "Free", 
    link: "https://notebooklm.google.com/", 
    tags: ["google", "research", "notes", "rag"],
    color: "primary", 
    icon: "auto_stories", 
    isOpenSource: false, 
    isTopRated: true,
    img: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=600&h=400"
};

if (!currentData.some(t => t.id === 'notebooklm')) {
    currentData.push(notebookLm);
    fs.writeFileSync(dataPath, JSON.stringify(currentData, null, 2));
    console.log("NotebookLM added successfully.");
} else {
    console.log("NotebookLM already exists.");
}
