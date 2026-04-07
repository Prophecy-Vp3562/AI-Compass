const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const aiTools = [
  { id: 'cursor', name: 'Cursor', desc: 'The AI-first Code Editor built for pair programming with an intelligent agent.', cat: 'Coding', icon: 'code', price: 'Freemium', color: 'warning', link: 'https://cursor.com', img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600&h=400' },
  { id: 'codeium', name: 'Codeium', desc: 'Free AI code completion and chat that integrates into your favorite IDEs.', cat: 'Dev', icon: 'code', price: 'Free', color: 'success', link: 'https://codeium.com', img: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=600&h=400' },
  { id: 'jasper', name: 'Jasper AI', desc: 'Enterprise-grade AI copilot for marketing copy, campaigns, and content strategy.', cat: 'Marketing', icon: 'rocket_launch', price: 'Premium', color: 'danger', link: 'https://jasper.ai', img: 'https://images.unsplash.com/photo-1557838923-2985c318be48?auto=format&fit=crop&q=80&w=600&h=400' },
  { id: 'hubspot', name: 'HubSpot AI', desc: 'AI tools native to your CRM to generate content, emails, and social posts instantly.', cat: 'Marketing', icon: 'rocket_launch', price: 'Freemium', color: 'warning', link: 'https://hubspot.com', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600&h=400' },
  { id: 'runway', name: 'Runway', desc: 'Advance your creativity with state-of-the-art AI video editing, generation, and effects.', cat: 'Video', icon: 'video_library', price: 'Freemium', color: 'warning', link: 'https://runwayml.com', img: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=600&h=400' },
  { id: 'suno', name: 'Suno AI', desc: 'Create original, full-length songs with vocals from simple text descriptions.', cat: 'Music', icon: 'music_note', price: 'Freemium', color: 'warning', link: 'https://suno.com', img: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&q=80&w=600&h=400' },
  { id: 'midjourney', name: 'Midjourney', desc: 'High-fidelity, prompt-based artistic image generation via Discord.', cat: 'Design', icon: 'image', price: 'Premium', color: 'danger', link: 'https://midjourney.com', img: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=600&h=400' },
  { id: 'recraft', name: 'Recraft', desc: 'AI design engine that lets you create and edit vector art, icons, and 3D images.', cat: 'Design', icon: 'image', price: 'Free', color: 'success', link: 'https://recraft.ai', img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=600&h=400' },
  { id: 'sprout', name: 'Sprout Social', desc: 'AI-driven social media management, listening, and sentiment analysis platform.', cat: 'Social', icon: 'forum', price: 'Premium', color: 'danger', link: 'https://sproutsocial.com', img: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=600&h=400' },
  { id: 'aiprm', name: 'AIPRM', desc: 'Curated prompt templates for ChatGPT, Midjourney, and more to supercharge workflows.', cat: 'Prompt', icon: 'terminal', price: 'Freemium', color: 'warning', link: 'https://aiprm.com', img: 'https://images.unsplash.com/photo-1655720828018-edd2daec9349?auto=format&fit=crop&q=80&w=600&h=400' },
  { id: 'gptmaker', name: 'GPT Prompt Maker', desc: 'Framework-based prompt generator for major LLMs using CO-STAR/RISEN.', cat: 'Prompt', icon: 'terminal', price: 'Free', color: 'success', link: 'https://gptpromptmaker.com', img: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=600&h=400' },
  // Tools from Newest section
  { id: 'prismai', name: 'Prism AI', desc: 'LaTeX-native, AI-powered workspace designed for scientists and researchers.', cat: 'Productivity', icon: 'integration_instructions', price: 'Free', color: 'success', link: 'https://prism.page/?ref=taaft&utm_source=taaft&utm_medium=referral', img: 'https://www.transparenttextures.com/patterns/cubes.png', isNew: true, gradient: 'from-indigo-900/40 to-black' },
  { id: 'websitepublisher', name: 'Website Publisher AI', desc: 'Describe a website and let the AI instantly build, design, and publish it.', cat: 'Coding', icon: 'language', price: 'Freemium', color: 'warning', link: 'https://www.websitepublisher.ai/?ref=taaft_feat&utm_source=taaft_feat&utm_medium=referral', isNew: true, gradient: 'from-[#1b1b20] to-[#0d0d12]' },
  { id: 'autonoma', name: 'Autonoma', desc: 'AI-powered platform for agentic testing in real browsers and devices.', cat: 'Coding', icon: 'bug_report', price: 'Premium', color: 'danger', link: 'https://www.getautonoma.com/?ref=taaft&utm_source=taaft&utm_medium=referral', isNew: true, gradient: 'from-green-900/30 to-[#0a0a0f]' },
  { id: 'likeclaw', name: 'LikeClaw', desc: 'Cloud-based platform using autonomous AI agents to execute complex online tasks.', cat: 'Productivity', icon: 'webhook', price: 'Freemium', color: 'warning', link: 'https://likeclaw.ai/?ref=taaft_feat&utm_source=taaft_feat&utm_medium=referral', isNew: true, gradient: 'from-purple-900/30 to-[#0a0a0f]' },
  { id: 'averi', name: 'Averi AI', desc: 'AI marketing workspace for startups to draft and publish SEO optimized content.', cat: 'Marketing', icon: 'campaign', price: 'Freemium', color: 'warning', link: 'https://www.averi.ai/?ref=taaft&utm_source=taaft&utm_medium=referral', isNew: true, gradient: 'from-blue-900/30 to-[#0a0a0f]' },
  { id: 'freebeat', name: 'Freebeat', desc: 'Turns audio tracks into fully edited, beat-synced AI music videos.', cat: 'Video', icon: 'music_video', price: 'Free', color: 'success', link: 'https://freebeat.ai/?utm_source=TAAFT&utm_medium=referral&utm_campaign=TAAFT_20250325&utm_content=submittool', isNew: true, gradient: 'from-teal-900/30 to-[#0a0a0f]' },
  { id: 'kinovi', name: 'Kinovi AI', desc: 'AI-powered studio for creating directed, cinematic cinematic video clips.', cat: 'Video', icon: 'movie', price: 'Premium', color: 'danger', link: 'https://kinovi.ai/?ref=taaft&utm_source=taaft&utm_medium=referral', isNew: true, gradient: 'from-orange-900/30 to-[#0a0a0f]' },
  { id: 'betterself', name: 'Betterself Check', desc: 'AI-powered wellness, productivity, and habit tracking check-in app.', cat: 'Productivity', icon: 'fact_check', price: 'Free', color: 'success', link: 'https://betterselfcheck.com/self-tests/?ref=taaft&utm_source=taaft&utm_medium=referral', isNew: true, gradient: 'from-[#1b1b20] to-cyan-900/30' },
  { id: 'scenes', name: 'Scenes AI', desc: 'Professional-grade platform that transforms text prompts into complete videos.', cat: 'Video', icon: 'theaters', price: 'Freemium', color: 'warning', link: 'https://www.usescenes.com/?ref=taaft&utm_source=taaft&utm_medium=referral', isNew: true, gradient: 'from-red-900/30 to-[#0a0a0f]' },
  { id: 'chatte', name: 'Chatte', desc: 'An advanced and conversational text-generation interface for rich dialogues.', cat: 'Writing', icon: 'chat', price: 'Free', color: 'success', link: 'https://chattee.ai/?ref=taaft&utm_source=taaft&utm_medium=referral', isNew: true, gradient: 'from-pink-900/30 to-[#0a0a0f]' },
  { id: 'lorekeeper', name: 'Lorekeeper', desc: 'AI tool designed for immersive worldbuilding and complex character character role-playing.', cat: 'Writing', icon: 'menu_book', price: 'Freemium', color: 'warning', link: 'https://lore-keeper.com/register?ref=taaft&utm_source=taaft&utm_medium=referral', isNew: true, gradient: 'from-yellow-900/30 to-[#0a0a0f]' },
  { id: 'napkin', name: 'Napkin AI', desc: 'Transforms standard text into engaging visual diagrams, flowcharts, and infographics.', cat: 'Productivity', icon: 'account_tree', price: 'Premium', color: 'danger', link: 'https://www.napkin.ai/?ref=taaft&utm_source=taaft&utm_medium=referral', isNew: true, gradient: 'from-indigo-900/30 to-[#0a0a0f]' },
  { id: 'toolvideo', name: 'tool.video', desc: 'An all-in-one AI video toolkit featuring integrations like Sora 2 and auto-watermarking.', cat: 'Video', icon: 'smart_display', price: 'Freemium', color: 'warning', link: 'https://tool.video/', isNew: true, gradient: 'from-cyan-900/30 to-[#0a0a0f]' },
  { id: 'aidubbing', name: 'AIDubbing.io', desc: 'Video localization platform generating multi-lingual native lip-sync dubs.', cat: 'Video', icon: 'record_voice_over', price: 'Free', color: 'success', link: 'https://aidubbing.io/audio-translate?ref=taaft&utm_source=taaft&utm_medium=referral', isNew: true, gradient: 'from-blue-700/30 to-purple-800/20' }
];

app.get('/api/search', (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.json([]);
  }

  const lowercaseQuery = query.toLowerCase();
  const results = aiTools.filter(tool => 
    tool.name.toLowerCase().includes(lowercaseQuery) || 
    tool.desc.toLowerCase().includes(lowercaseQuery) ||
    tool.cat.toLowerCase().includes(lowercaseQuery)
  );

  res.json(results);
});

app.listen(port, () => {
  console.log(`Backend API running on http://localhost:${port}`);
});
