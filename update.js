const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'index.html');
let content = fs.readFileSync(file, 'utf8');

const categoriesHtml = `<!-- Categories -->
<div class="flex-none w-48 h-48 glass-card rounded-lg p-6 flex flex-col justify-between hover:scale-105 hover:bg-white/10 transition-all cursor-pointer group" onclick="window.location.hash='#marketing'">
<span class="material-symbols-outlined text-primary text-3xl">rocket_launch</span>
<div><p class="font-headline font-bold text-lg">Marketing</p><p class="text-xs text-white/40">2 tools</p></div>
</div>
<div class="flex-none w-48 h-48 glass-card rounded-lg p-6 flex flex-col justify-between hover:scale-105 hover:bg-white/10 transition-all cursor-pointer group" onclick="window.location.hash='#coding'">
<span class="material-symbols-outlined text-secondary text-3xl">code</span>
<div><p class="font-headline font-bold text-lg">Coding & Dev</p><p class="text-xs text-white/40">2 tools</p></div>
</div>
<div class="flex-none w-48 h-48 glass-card rounded-lg p-6 flex flex-col justify-between hover:scale-105 hover:bg-white/10 transition-all cursor-pointer group" onclick="window.location.hash='#video'">
<span class="material-symbols-outlined text-warning text-3xl">video_library</span>
<div><p class="font-headline font-bold text-lg">Video Gen</p><p class="text-xs text-white/40">1 tool</p></div>
</div>
<div class="flex-none w-48 h-48 glass-card rounded-lg p-6 flex flex-col justify-between hover:scale-105 hover:bg-white/10 transition-all cursor-pointer group" onclick="window.location.hash='#music'">
<span class="material-symbols-outlined text-success text-3xl">music_note</span>
<div><p class="font-headline font-bold text-lg">Music Gen</p><p class="text-xs text-white/40">1 tool</p></div>
</div>
<div class="flex-none w-48 h-48 glass-card rounded-lg p-6 flex flex-col justify-between hover:scale-105 hover:bg-white/10 transition-all cursor-pointer group" onclick="window.location.hash='#image'">
<span class="material-symbols-outlined text-tertiary-container text-3xl">image</span>
<div><p class="font-headline font-bold text-lg">Image Gen</p><p class="text-xs text-white/40">2 tools</p></div>
</div>
<div class="flex-none w-48 h-48 glass-card rounded-lg p-6 flex flex-col justify-between hover:scale-105 hover:bg-white/10 transition-all cursor-pointer group" onclick="window.location.hash='#social'">
<span class="material-symbols-outlined text-[#f43f5e] text-3xl">forum</span>
<div><p class="font-headline font-bold text-lg">Social Media</p><p class="text-xs text-white/40">1 tool</p></div>
</div>
<div class="flex-none w-48 h-48 glass-card rounded-lg p-6 flex flex-col justify-between hover:scale-105 hover:bg-white/10 transition-all cursor-pointer group" onclick="window.location.hash='#prompt'">
<span class="material-symbols-outlined text-primary text-3xl">terminal</span>
<div><p class="font-headline font-bold text-lg">Prompt Gen</p><p class="text-xs text-white/40">2 tools</p></div>
</div>`;

const tools = [
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
  { id: 'gptmaker', name: 'GPT Prompt Maker', desc: 'Framework-based prompt generator for major LLMs using CO-STAR/RISEN.', cat: 'Prompt', icon: 'terminal', price: 'Free', color: 'success', link: 'https://gptpromptmaker.com', img: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=600&h=400' }
];

let toolsHtml = '';
for (const tool of tools) {
toolsHtml += `<!-- Tool Card -->
<div id="${tool.id}" class="group flex flex-col glass-card rounded-lg overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,212,255,0.1)]">
<div class="relative h-56 overflow-hidden">
<img class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="${tool.img}" alt="${tool.name}"/>
<div class="absolute top-4 right-4 bg-${tool.color}/20 backdrop-blur-md px-3 py-1 rounded-full border border-${tool.color}/30">
<span class="text-[10px] font-bold text-${tool.color} uppercase tracking-widest">${tool.price}</span>
</div>
</div>
<div class="p-6 flex flex-col flex-grow">
<div class="flex items-center gap-2 mb-2">
<h3 class="font-headline font-bold text-xl">${tool.name}</h3>
</div>
<p class="text-on-surface-variant text-sm line-clamp-2 mb-6 h-10">${tool.desc}</p>
<div class="flex flex-wrap gap-2 mb-8">
<span class="px-2 py-1 rounded bg-white/5 text-[10px] font-medium text-white/60">${tool.cat}</span>
</div>
<div class="mt-auto flex items-center justify-between">
<a href="${tool.link}" target="_blank" class="text-primary text-sm font-bold flex items-center gap-2 group/btn">
Visit Site <span class="material-symbols-outlined text-lg transition-transform group-hover/btn:translate-x-1">arrow_forward</span>
</a>
<span class="material-symbols-outlined text-white/20 hover:text-primary cursor-pointer transition-colors">bookmark</span>
</div>
</div>
</div>\n`;
}

// Regex to replace categories
content = content.replace(/<!-- Categories -->([\s\S]*?)<\/div>\s*<\/section>/, categoriesHtml + '\n</div>\n</section>');

// Regex to replace tool cards
content = content.replace(/<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">([\s\S]*?)<!-- Skeleton Loading State/, '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">\n' + toolsHtml + '\n</div>\n<!-- Skeleton Loading State');

// Remove skeleton loading state
content = content.replace(/<!-- Skeleton Loading State \(Main Grid placeholder\) -->([\s\S]*?)<\/section>/, '</section>');

fs.writeFileSync(file, content, 'utf8');
console.log('Update complete');
